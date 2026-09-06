# VerseOff License-Bound Distribution and Authentication

## Product requirement

VerseOff does not introduce a separate per-user VerseOff license.

Eligibility is based on the customer's existing Microsoft licensing and access
governance:

- the user has the appropriate Dynamics 365 or Power Platform license;
- the user is enabled in the target Dataverse environment;
- the user has the required Dataverse security roles;
- the user is allowed to use the selected model-driven app;
- the device and user satisfy the customer's Intune and Conditional Access
  policies.

There is no registration per generated target app and no client secret in the
native application.

The canonical VerseOff mode is Mode B: the installed native application has no
Entra client ID and synchronizes only through the customer-operated BCDR
gateway.

## Important Microsoft identity constraint

Microsoft documents that app registration is required before a custom
application can authenticate with Dataverse and access business data.

A Microsoft product license and an OAuth application identity solve different
problems:

| Control | Purpose |
|---|---|
| Microsoft user license | Commercial entitlement to use Dynamics 365/Power Platform capabilities |
| Dataverse security role | Authorization to tables, rows, columns, apps, and operations |
| Entra application/client ID | Identity, consent, Conditional Access, and audit boundary for the software requesting a token |
| User token | Proof of the signed-in user and delegated authorization |

Therefore:

> A standalone custom native app cannot directly authenticate to Dataverse
> using only the user's Microsoft license and no application/client identity.

Do not use a Microsoft first-party or sample client ID as VerseOff's identity.
Do not embed a confidential-client secret in a desktop or mobile application.

## What can be achieved

The intended user experience can still be achieved:

- no registration for every generated app;
- no registration for every user;
- no Dataverse application user in delegated direct mode;
- no client secret;
- no separate VerseOff user license;
- one enterprise-governed integration identity at the appropriate boundary;
- download and use restricted to an existing Microsoft-licensed user group.

## Mode A: Customer-owned direct delegated client

### Description

The customer registers one single-tenant public client named for VerseOff. All
generated app configurations use that same client identity.

The native app uses:

- MSAL.NET;
- Windows Web Account Manager on Windows;
- system browser/broker authentication on supported mobile platforms;
- delegated Dynamics CRM `user_impersonation` access;
- the signed-in user's Dataverse privileges.

No secret is stored because a native app is a public client.

### Benefits

- Microsoft-standard identity architecture.
- Every Dataverse call carries the actual user identity.
- Conditional Access and enterprise-app assignment apply directly.
- Dataverse auditing and throttling are naturally user-scoped.
- No highly privileged sync service needs to impersonate users.
- One registration covers all generated target apps for that customer.

### Tradeoff

This mode has a client ID. The client ID is a public identifier, not a secret
or a separate license.

For a regulated bank, this is usually the cleanest and most governable mode.

## Mode B: Native app with no client ID

### Description

In this mode, the VerseOff native package contains no Entra application/client
ID and never calls Dataverse directly.

The client communicates only with a customer-operated VerseOff BCDR gateway:

```text
VerseOff native app
  -> Windows Integrated Authentication or managed user/device certificate
  -> customer-operated BCDR gateway
  -> gateway's governed Dataverse workload identity
  -> Dataverse
```

The gateway owns the unavoidable Entra/Dataverse application identity. This
meets the narrower requirement that the **native app itself** does not depend
on an app registration.

### Windows authentication

For a Windows-first managed deployment, the gateway can use ASP.NET Core
Windows Authentication with Negotiate/Kerberos on the corporate network.

For managed mobile devices, use customer-issued user/device certificates and
mutual TLS, with explicit user-to-device binding. This is not equivalent to a
Microsoft user OAuth token and requires customer security approval.

### Dataverse write attribution

The gateway must not collapse users into an anonymous integration identity.

Where approved, it can use Dataverse's documented impersonation support:

- identify the licensed Dataverse user;
- send `CallerObjectId` with that user's Entra object ID;
- require the gateway application user to have the Delegate/Act on Behalf of
  Another User privilege;
- rely on the intersection of gateway and impersonated-user privileges;
- record the user, device, entitlement lease, operation, and correlation ID.

This is a powerful privilege and may receive more scrutiny than Mode A.

### Tradeoffs

- The app has no client ID.
- The overall system still requires a gateway workload identity.
- Cross-platform user identity is more complex.
- The gateway becomes a critical regulated service.
- Dataverse impersonation and audit behavior must be tested.
- Multiplexing does not remove Microsoft user-license requirements.

## Unsupported interpretation

If "no app registration" means no application identity anywhere in the
client, gateway, or integration, then direct or indirect Dataverse sync is not
available through Microsoft's supported cloud authentication model.

The only Microsoft-first-party alternative is to run inside an existing
Microsoft host such as Power Apps mobile. That would no longer be the
independent VerseOff native BCDR runtime and would inherit the host's offline
capabilities and limitations.

## License-bound distribution

### Recommended enterprise pattern

Create a customer-managed Entra group such as:

```text
VerseOff-D365-Licensed-Users
```

Use the same governed group for:

- Microsoft license assignment or reconciliation;
- Dataverse security-role assignment;
- source model-driven app access;
- Intune application availability;
- gateway authorization;
- VerseOff entitlement-lease issuance.

Assign the signed MSIX as **Available for enrolled devices** or **Required**
through Microsoft Intune. The application then appears in Company Portal only
for the assigned users/devices.

Do not rely on a public download page to prove Microsoft licensing.

### AppSource and Marketplace

AppSource can distribute the VerseOff managed solution and support commercial
discovery. It is not the primary bank-grade native-binary entitlement
mechanism.

For the stated model:

- list the offer as free or bring-your-own Microsoft license, subject to
  Microsoft's marketplace rules;
- do not use Marketplace metering for per-user VerseOff licensing;
- deploy the signed native package through the customer's Intune tenant;
- require existing Microsoft licenses under the applicable Product Terms.

## Runtime entitlement validation

### Online provisioning

Before issuing an entitlement:

1. Verify the user belongs to the customer-managed licensed-users group.
2. Verify the device is managed and compliant.
3. Verify the Dataverse environment and tenant.
4. Verify the Dataverse user is enabled.
5. Verify required security roles and source-app access.
6. Record the applicable Microsoft license-policy decision.
7. Issue a signed, bounded entitlement lease.

Do not give the app broad Microsoft Graph license-reading permissions merely to
inspect SKUs. The customer should own the entitlement group and its licensing
process.

### Signed offline entitlement lease

BCDR operation cannot require a live license lookup during an outage.

The gateway issues a signed lease containing:

- tenant ID;
- user object ID;
- device ID;
- Dataverse environment ID;
- target app module ID;
- profile ID and hash;
- security snapshot version;
- issued time;
- offline expiration time;
- permitted BCDR capabilities;
- issuer and signing-key ID.

The native app validates the signature locally. It never edits or extends the
lease.

### Expiration behavior

The customer chooses an outage grace period, for example:

- short grace: 24 hours;
- standard BCDR grace: 7 days;
- exceptional declared-disaster grace: 30 days.

After expiration:

- writes stop or enter a quarantined queue according to policy;
- sensitive reads fail closed;
- non-sensitive emergency forms may remain available only if approved;
- the app requests revalidation as soon as a trusted service is reachable.

Strict live revocation and fully disconnected operation cannot both be
guaranteed. The signed grace period is the explicit enterprise risk decision.

## License compliance

- Every person using or benefiting from Dataverse through VerseOff must have
  the appropriate Microsoft license when required by Product Terms.
- A gateway, service account, read cache, or OneLake projection does not reduce
  license counts through multiplexing.
- Preserve individual user identity and authorization.
- Do not use a shared account to bypass user licensing.
- Review external-user and device-license cases separately.
- Obtain written Microsoft licensing guidance for the final SKU, tables,
  operations, and deployment architecture.

## Product decision

VerseOff's canonical deployment follows the stated no-client-AppId
requirement:

1. Use Mode B.
2. Put no Entra client ID or secret in the installed app.
3. Assign the app to the Microsoft-licensed users group through Intune.
4. Issue a signed offline entitlement lease.
5. Synchronize only through the customer-operated gateway.
6. Keep the unavoidable workload identity at the gateway's Dataverse boundary.
7. Preserve the licensed user's identity and privileges through documented
   Dataverse impersonation where approved.

Mode A remains an enterprise deployment option when a customer prefers direct
delegated user tokens and accepts one bank-owned, single-tenant public client
registration for all generated apps. It is not the default VerseOff mode.

## Official references

- [Register an app with Microsoft Entra ID for Dataverse](https://learn.microsoft.com/power-apps/developer/data-platform/walkthrough-register-app-azure-active-directory)
- [Use OAuth authentication with Dataverse](https://learn.microsoft.com/power-apps/developer/data-platform/authenticate-oauth)
- [Publisher verification](https://learn.microsoft.com/entra/identity-platform/publisher-verification-overview)
- [MSAL.NET with Windows Web Account Manager](https://learn.microsoft.com/entra/msal/dotnet/acquiring-tokens/desktop-mobile/wam)
- [Impersonate another Dataverse user](https://learn.microsoft.com/power-apps/developer/data-platform/impersonate-another-user)
- [Assign apps to groups with Intune](https://learn.microsoft.com/mem/intune/apps/apps-deploy)
- [Microsoft multiplexing guidance](https://www.microsoft.com/licensing/guidance/Multiplexing)
- [Microsoft Product Terms](https://www.microsoft.com/licensing/terms)
