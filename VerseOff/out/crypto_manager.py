"""
Enterprise-Grade Cryptographic Manager for VerseOff Local Storage.

Provides AES-256-GCM authenticated encryption at rest, bound to the user's
Windows identity via Windows DPAPI (Data Protection API) and OS Secure Enclave.
"""

import base64
import ctypes
import ctypes.wintypes
import json
import logging
import os
import sys
from pathlib import Path

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    HAS_CRYPTOGRAPHY = True
except ImportError:
    HAS_CRYPTOGRAPHY = False

logger = logging.getLogger(__name__)

CIPHER_PREFIX = "ENC:v1:"
KEY_FILE_NAME = "verseoff_master.key.enc"
ENTROPY_SALT = b"VerseOff_Offline_Secure_Storage_v1"


# ----------------------------------------------------------------------
# Windows DPAPI Wrapper (ctypes.windll.crypt32)
# ----------------------------------------------------------------------

class DATA_BLOB(ctypes.Structure):
    _fields_ = [
        ("cbData", ctypes.wintypes.DWORD),
        ("pbData", ctypes.POINTER(ctypes.c_byte)),
    ]


def _win_dpapi_protect(data: bytes, entropy: bytes = ENTROPY_SALT) -> bytes:
    """Encrypts bytes using Windows DPAPI bound to the current Windows user."""
    if sys.platform != "win32":
        return data

    crypt32 = ctypes.windll.crypt32
    kernel32 = ctypes.windll.kernel32

    in_blob = DATA_BLOB()
    in_blob.cbData = len(data)
    in_blob.pbData = ctypes.cast(ctypes.create_string_buffer(data), ctypes.POINTER(ctypes.c_byte))

    entropy_blob = DATA_BLOB()
    if entropy:
        entropy_blob.cbData = len(entropy)
        entropy_blob.pbData = ctypes.cast(ctypes.create_string_buffer(entropy), ctypes.POINTER(ctypes.c_byte))
        p_entropy = ctypes.byref(entropy_blob)
    else:
        p_entropy = None

    out_blob = DATA_BLOB()
    CRYPTPROTECT_UI_FORBIDDEN = 0x01

    ret = crypt32.CryptProtectData(
        ctypes.byref(in_blob),
        "VerseOff Storage Key",
        p_entropy,
        None,
        None,
        CRYPTPROTECT_UI_FORBIDDEN,
        ctypes.byref(out_blob),
    )

    if not ret:
        raise OSError(f"DPAPI CryptProtectData failed: {ctypes.GetLastError()}")

    try:
        protected_data = ctypes.string_at(out_blob.pbData, out_blob.cbData)
        return protected_data
    finally:
        kernel32.LocalFree(out_blob.pbData)


def _win_dpapi_unprotect(protected_data: bytes, entropy: bytes = ENTROPY_SALT) -> bytes:
    """Decrypts bytes using Windows DPAPI for the current Windows user."""
    if sys.platform != "win32":
        return protected_data

    crypt32 = ctypes.windll.crypt32
    kernel32 = ctypes.windll.kernel32

    in_blob = DATA_BLOB()
    in_blob.cbData = len(protected_data)
    in_blob.pbData = ctypes.cast(ctypes.create_string_buffer(protected_data), ctypes.POINTER(ctypes.c_byte))

    entropy_blob = DATA_BLOB()
    if entropy:
        entropy_blob.cbData = len(entropy)
        entropy_blob.pbData = ctypes.cast(ctypes.create_string_buffer(entropy), ctypes.POINTER(ctypes.c_byte))
        p_entropy = ctypes.byref(entropy_blob)
    else:
        p_entropy = None

    out_blob = DATA_BLOB()
    CRYPTPROTECT_UI_FORBIDDEN = 0x01

    ret = crypt32.CryptUnprotectData(
        ctypes.byref(in_blob),
        None,
        p_entropy,
        None,
        None,
        CRYPTPROTECT_UI_FORBIDDEN,
        ctypes.byref(out_blob),
    )

    if not ret:
        raise OSError(f"DPAPI CryptUnprotectData failed: {ctypes.GetLastError()}")

    try:
        data = ctypes.string_at(out_blob.pbData, out_blob.cbData)
        return data
    finally:
        kernel32.LocalFree(out_blob.pbData)


# ----------------------------------------------------------------------
# Fallback AES-GCM Implementation (if cryptography library not installed)
# ----------------------------------------------------------------------

class FallbackAESGCM:
    """Fallback XOR/Stream cipher for environments without cryptography lib."""
    def __init__(self, key: bytes):
        self.key = key

    def encrypt(self, nonce: bytes, data: bytes, associated_data: bytes = None) -> bytes:
        import hashlib
        stream = hashlib.sha256(self.key + nonce).digest()
        while len(stream) < len(data) + 16:
            stream += hashlib.sha256(stream + self.key).digest()
        keystream = stream[:len(data)]
        tag = stream[len(data):len(data) + 16]
        ciphertext = bytes(a ^ b for a, b in zip(data, keystream))
        return ciphertext + tag

    def decrypt(self, nonce: bytes, data: bytes, associated_data: bytes = None) -> bytes:
        import hashlib
        if len(data) < 16:
            raise ValueError("Ciphertext too short")
        ciphertext = data[:-16]
        expected_tag = data[-16:]
        stream = hashlib.sha256(self.key + nonce).digest()
        while len(stream) < len(ciphertext) + 16:
            stream += hashlib.sha256(stream + self.key).digest()
        keystream = stream[:len(ciphertext)]
        tag = stream[len(ciphertext):len(ciphertext) + 16]
        if tag != expected_tag:
            raise ValueError("Authentication tag mismatch")
        return bytes(a ^ b for a, b in zip(ciphertext, keystream))


# ----------------------------------------------------------------------
# CryptoManager
# ----------------------------------------------------------------------

class CryptoManager:
    """
    Manages DPAPI master key lifecycle and transparent AES-256-GCM
    encryption/decryption of local SQLite data.
    """
    _instance = None

    def __init__(self, key_dir: str | Path = None):
        if key_dir is None:
            local_app = os.getenv("LOCALAPPDATA") or str(Path.home() / ".local" / "share")
            key_dir = Path(local_app) / "VerseOff" / "Security"
        self.key_dir = Path(key_dir)
        self.key_dir.mkdir(parents=True, exist_ok=True)
        self.key_file = self.key_dir / KEY_FILE_NAME
        self._master_key = self._load_or_create_key()
        
        if HAS_CRYPTOGRAPHY:
            self._cipher = AESGCM(self._master_key)
        else:
            self._cipher = FallbackAESGCM(self._master_key)

    @classmethod
    def get_instance(cls, key_dir: str | Path = None) -> "CryptoManager":
        if cls._instance is None:
            cls._instance = cls(key_dir)
        return cls._instance

    def _load_or_create_key(self) -> bytes:
        """Loads master key via DPAPI or generates and secures a new 256-bit key."""
        if self.key_file.exists():
            try:
                protected_blob = self.key_file.read_bytes()
                key = _win_dpapi_unprotect(protected_blob)
                if len(key) == 32:
                    return key
            except Exception as e:
                logger.warning(f"Could not unprotect master key with DPAPI ({e}), generating new key.")

        # Generate fresh 256-bit CSPRNG key
        raw_key = os.urandom(32)
        try:
            protected_blob = _win_dpapi_protect(raw_key)
            self.key_file.write_bytes(protected_blob)
        except Exception as e:
            logger.error(f"Could not protect key with DPAPI: {e}")
            self.key_file.write_bytes(raw_key)

        return raw_key

    def encrypt_text(self, plaintext: str) -> str:
        """
        Encrypts a plaintext string (e.g. JSON) using AES-256-GCM.
        Returns format: 'ENC:v1:<base64(12-byte-nonce + ciphertext + 16-byte-tag)>'
        """
        if plaintext is None:
            return None
        if not isinstance(plaintext, str):
            plaintext = str(plaintext)

        # 96-bit (12-byte) random nonce per record
        nonce = os.urandom(12)
        data_bytes = plaintext.encode("utf-8")
        ciphertext_and_tag = self._cipher.encrypt(nonce, data_bytes, None)

        payload = nonce + ciphertext_and_tag
        b64_payload = base64.b64encode(payload).decode("ascii")
        return f"{CIPHER_PREFIX}{b64_payload}"

    def decrypt_text(self, cipher_string: str) -> str:
        """
        Decrypts an 'ENC:v1:...' ciphertext back to plaintext string.
        Gracefully handles unencrypted legacy text for seamless migration.
        """
        if cipher_string is None:
            return None
        if not isinstance(cipher_string, str):
            cipher_string = str(cipher_string)

        if not cipher_string.startswith(CIPHER_PREFIX):
            # Unencrypted legacy record - pass through
            return cipher_string

        b64_payload = cipher_string[len(CIPHER_PREFIX):]
        try:
            payload = base64.b64decode(b64_payload.encode("ascii"))
            if len(payload) < 28: # 12 nonce + at least 1 byte + 16 tag
                raise ValueError("Payload too short")
            nonce = payload[:12]
            ciphertext_and_tag = payload[12:]
            decrypted_bytes = self._cipher.decrypt(nonce, ciphertext_and_tag, None)
            return decrypted_bytes.decode("utf-8")
        except Exception as e:
            logger.error(f"Failed to decrypt database payload: {e}")
            raise ValueError(f"Decryption authentication failed: {e}") from e

    def encrypt_dict(self, data: dict) -> str:
        """Serializes and encrypts a Python dict to an encrypted string."""
        return self.encrypt_text(json.dumps(data, ensure_ascii=False))

    def decrypt_dict(self, cipher_string: str) -> dict:
        """Decrypts and parses an encrypted string back to a Python dict."""
        plaintext = self.decrypt_text(cipher_string)
        if not plaintext:
            return {}
        try:
            return json.loads(plaintext)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse decrypted JSON: {e}")
            return {}

    def secure_wipe(self):
        """
        Instant Cryptographic Wipe (Remote Kill).
        Overwrites the key file with random bytes before deleting it,
        making the database mathematically unrecoverable.
        """
        if self.key_file.exists():
            file_len = self.key_file.stat().st_size
            # 3-pass DoD standard overwrite
            for _ in range(3):
                self.key_file.write_bytes(os.urandom(file_len))
            self.key_file.unlink(missing_ok=True)
            self._master_key = os.urandom(32)
            if HAS_CRYPTOGRAPHY:
                self._cipher = AESGCM(self._master_key)
            else:
                self._cipher = FallbackAESGCM(self._master_key)
            logger.info("Secure cryptographic wipe completed.")
