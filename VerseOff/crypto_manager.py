import os
import ctypes
from ctypes import wintypes
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import logging
import json

logger = logging.getLogger(__name__)

# Windows DPAPI constants
CRYPTPROTECT_UI_FORBIDDEN = 0x1

class DATA_BLOB(ctypes.Structure):
    _fields_ = [("cbData", wintypes.DWORD),
                ("pbData", ctypes.POINTER(ctypes.c_byte))]

class CryptoManager:
    """
    Enterprise-Grade Encryption at Rest using AES-256-GCM + Windows DPAPI.
    
    The Master Key is generated via CSPRNG (os.urandom(32)) and protected via
    Windows DPAPI (CryptProtectData). This binds the key to the Windows User Account
    and the local machine (TPM-backed if available).
    
    Database records are encrypted individually using AES-256-GCM.
    Ciphertext format: ENC:v1:<base64( nonce(12) + ciphertext + tag(16) )>
    """
    
    PREFIX = "ENC:v1:"
    KEY_FILE = "master_key.bin"

    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.key_path = os.path.join(data_dir, self.KEY_FILE)
        self.master_key = self._load_or_create_key()
        self.aesgcm = AESGCM(self.master_key)
        
    def _load_or_create_key(self) -> bytes:
        if os.path.exists(self.key_path):
            try:
                with open(self.key_path, "rb") as f:
                    encrypted_key = f.read()
                return self._dpapi_decrypt(encrypted_key)
            except Exception as e:
                logger.error(f"Failed to load/decrypt master key: {e}")
                # If we fail, it's a catastrophic error for reading old data.
                # In a real app we might prompt the user or abort.
                raise RuntimeError("Could not decrypt database master key. Are you logged in as the correct Windows user?")
        
        # Create new key
        logger.info("Generating new AES-256 master key protected by DPAPI...")
        new_key = AESGCM.generate_key(bit_length=256)
        encrypted_key = self._dpapi_encrypt(new_key)
        
        os.makedirs(self.data_dir, exist_ok=True)
        with open(self.key_path, "wb") as f:
            f.write(encrypted_key)
            
        return new_key

    def _dpapi_encrypt(self, data: bytes) -> bytes:
        """Encrypt data using Windows DPAPI (tied to current user)."""
        data_in = DATA_BLOB(len(data), ctypes.cast(ctypes.c_char_p(data), ctypes.POINTER(ctypes.c_byte)))
        data_out = DATA_BLOB()
        
        # CryptProtectData(pDataIn, szDataDescr, pOptionalEntropy, pvReserved, pPromptStruct, dwFlags, pDataOut)
        if ctypes.windll.crypt32.CryptProtectData(
                ctypes.byref(data_in),
                u"VerseOff Master Key",
                None, # Optional entropy could go here for extra security
                None,
                None,
                CRYPTPROTECT_UI_FORBIDDEN,
                ctypes.byref(data_out)):
            
            result = bytes(ctypes.cast(data_out.pbData, ctypes.POINTER(ctypes.c_byte * data_out.cbData)).contents)
            ctypes.windll.kernel32.LocalFree(data_out.pbData)
            return result
        else:
            raise ctypes.WinError()

    def _dpapi_decrypt(self, encrypted_data: bytes) -> bytes:
        """Decrypt data using Windows DPAPI."""
        data_in = DATA_BLOB(len(encrypted_data), ctypes.cast(ctypes.c_char_p(encrypted_data), ctypes.POINTER(ctypes.c_byte)))
        data_out = DATA_BLOB()
        
        if ctypes.windll.crypt32.CryptUnprotectData(
                ctypes.byref(data_in),
                None,
                None,
                None,
                None,
                CRYPTPROTECT_UI_FORBIDDEN,
                ctypes.byref(data_out)):
            
            result = bytes(ctypes.cast(data_out.pbData, ctypes.POINTER(ctypes.c_byte * data_out.cbData)).contents)
            ctypes.windll.kernel32.LocalFree(data_out.pbData)
            return result
        else:
            raise ctypes.WinError()

    def encrypt_string(self, plaintext: str) -> str:
        """Encrypt a string and return the ENC:v1 format."""
        if plaintext is None:
            return None
            
        nonce = os.urandom(12)
        # AESGCM.encrypt appends the 16-byte authentication tag automatically
        ciphertext = self.aesgcm.encrypt(nonce, plaintext.encode('utf-8'), None)
        
        # Payload: nonce (12) + ciphertext + tag (16)
        payload = nonce + ciphertext
        encoded = base64.b64encode(payload).decode('utf-8')
        
        return f"{self.PREFIX}{encoded}"
        
    def decrypt_string(self, encrypted_string: str) -> str:
        """Decrypt an ENC:v1 format string."""
        if encrypted_string is None:
            return None
            
        if not encrypted_string.startswith(self.PREFIX):
            # Return as-is (e.g. for migrating unencrypted data, or if it's plain JSON)
            return encrypted_string
            
        try:
            b64_data = encrypted_string[len(self.PREFIX):]
            payload = base64.b64decode(b64_data)
            
            if len(payload) < 28: # 12(nonce) + 16(tag) = 28 min
                raise ValueError("Payload too short to be valid AES-GCM")
                
            nonce = payload[:12]
            ciphertext = payload[12:]
            
            plaintext = self.aesgcm.decrypt(nonce, ciphertext, None)
            return plaintext.decode('utf-8')
        except Exception as e:
            logger.error(f"Decryption failed: {e}")
            raise ValueError("Data corrupted or tampered with.")

    def encrypt_dict(self, data_dict: dict) -> str:
        """Helper to serialize dict to JSON and encrypt."""
        if data_dict is None:
            return None
        return self.encrypt_string(json.dumps(data_dict))
        
    def decrypt_dict(self, encrypted_string: str) -> dict:
        """Helper to decrypt and parse JSON to dict."""
        if encrypted_string is None:
            return None
            
        plaintext = self.decrypt_string(encrypted_string)
        try:
            return json.loads(plaintext)
        except json.JSONDecodeError:
            logger.error("Failed to parse decrypted string as JSON.")
            return {}

# Singleton instance initialized when needed
_crypto_manager_instance = None

def get_crypto_manager(data_dir: str) -> CryptoManager:
    global _crypto_manager_instance
    if _crypto_manager_instance is None:
        _crypto_manager_instance = CryptoManager(data_dir)
    return _crypto_manager_instance
