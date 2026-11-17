# Email (ZeptoMail)

The site sends five kinds of mail through ZeptoMail:

1. Contact-form notification to the admin.
2. Contact-form confirmation to the visitor.
3. Admissions-enquiry notification to the admin.
4. Admissions-enquiry confirmation to the visitor.
5. Admin password-reset link to the user.

All of them use the same database-backed configuration and the official
`zeptomail` Node SDK.

## Configuration

Sign in as a super admin, open **Admin -> Settings**, and fill in the ZeptoMail
section:

| Setting | Required | Notes |
| --- | --- | --- |
| Enabled | Yes | `getZeptoMailConfig()` returns `null` when off. |
| API endpoint | No | Defaults to `https://api.zeptomail.com/v1.1/email`. Trailing slashes are trimmed. |
| API token | Yes | Stored encrypted; entering a new value replaces the old one. |
| Sender email | Yes | Must be a verified sender/domain in ZeptoMail. |
| Sender name | No | Defaults to `STCET Website`. |
| Admin recipient | Yes | Receives contact and enquiry notifications. |
| Notify on contact | No | Per-form switch; defaults on. |
| Notify on enquiry | No | Per-form switch; defaults on. |

Two environment prerequisites:

- **`ZEPTOMAIL_ENCRYPTION_KEY`** must be set (32+ characters) before a token can
  be saved or decrypted. It derives an AES-256 key; changing it makes existing
  stored tokens undecryptable, so the token must be re-entered.
- **`NEXT_PUBLIC_BASE_URL`** must be the public origin in production. It is used
  to build the password-reset link. Without it, links point at
  `http://localhost:3000`.

### Token storage

- The token is encrypted with AES-256-GCM.
- The packed value is `salt:iv:tag:ciphertext` (base64 parts) in
  `SiteSettings.zeptoTokenEncrypted`; `zeptoTokenSalt` also exists for legacy
  compatibility.
- Decryption happens only on the server, per send.
- The token is never returned to the browser. The settings form shows whether a
  token is configured, not its value.
- Saved tokens may be entered with or without the `Zoho-enczapikey ` prefix. The
  code normalizes it to exactly one prefix before constructing the SDK client.

### Configuration resolution

`getZeptoMailConfig()` returns `null` when any of these is true:

- ZeptoMail is disabled,
- no encrypted token/salt is stored,
- sender email or admin email is missing,
- decryption fails (wrong `ZEPTOMAIL_ENCRYPTION_KEY` or corrupted data).

A `null` config makes every sender return
`{ success: false, message: "..." }`; it never throws to the caller.

## Sending

`sendZeptoMailEmail(config, payload)`:

- creates a `SendMailClient` with the configured URL and normalized token,
- sends `from` (sender email/name), `to`, `subject`, `htmlbody`, `textbody`,
- treats SDK acceptance as success,
- on failure, extracts code/message/response details, logs them, and returns
  `{ success: false, message, error }`.

Senders:

| Function | Recipient | Subject pattern |
| --- | --- | --- |
| `sendContactNotification` | `zeptoAdminEmail` | `New Contact Form Submission - <subject> - STCET` |
| `sendContactVisitorConfirmation` | visitor's email | `We have received your message - STCET` |
| `sendEnquiryNotification` | `zeptoAdminEmail` | `New Admissions Enquiry - <enquiryNumber> - STCET` |
| `sendEnquiryVisitorConfirmation` | student's email | `Admission enquiry received - <enquiryNumber> - STCET` |
| `sendPasswordResetEmail` | user's real account email | `Reset your STCET Admin password` |

All user-provided values are HTML-escaped before interpolation. Each mail has a
plain-text alternative.

## Contact and enquiry API behavior

Both endpoints (`/api/contact`, `/api/enquiry`) follow the same order:

1. Rate limit by client IP: **5 requests per hour**.
2. Parse JSON or `FormData`.
3. Validate fields (Zod / explicit checks).
4. Reject a duplicate submission from the same IP/contact within **2 minutes**.
5. Save the database record (`ContactMessage` / `Enquiry`).
6. Await the admin notification send and log success/failure.
7. Await the visitor confirmation send and log success/failure.
8. Return success to the browser.

The record is saved before email is attempted, and the API still returns success
when mail fails. This is deliberate: losing an enquiry because an email provider
is down is worse than an email failure that is visible in the logs and the admin
inbox.

If `zeptoNotifyContact` / `zeptoNotifyEnquiry` is off, the corresponding admin
mail is skipped (the sender returns a "not enabled" result), but the visitor
confirmation is still attempted.

The admin inboxes are at **Admin -> Contact Messages** and **Admin ->
Enquiries**, with CSV export at `/api/admin/contact-messages/export` and
`/api/admin/enquiries/export`.

## Password-reset email

`src/app/admin/forgot-password/actions.ts`:

- generates a 32-byte random token and emails the raw token in a link,
- stores only its SHA-256 hash with a 60-minute expiry,
- sends to the user's actual `AdminUser.email` (not the admin notification
  address),
- checks the send result; a failure redirects to `?error=send_failed`,
- shows the same success page for unknown/inactive/throttled accounts.

Link shape:

```text
<base>/admin/reset-password?token=<raw-token>
```

`<base>` comes from `NEXT_PUBLIC_BASE_URL`, then `VERCEL_URL`, then localhost.

## Test email

Settings has a **Send test email** action. It sends through the same
configuration and records the result in `zeptoLastTestAt` and
`zeptoLastTestResult`. Use it after every token/endpoint/sender change and before
launch.

A successful test proves:

- the token decrypts,
- the endpoint is reachable,
- the sender is accepted by ZeptoMail.

It does not prove the recipient's inbox/spam configuration.

## Debugging checklist

1. **Settings shows "not configured".** Enable ZeptoMail, save a token, sender
   email, and admin email. Confirm `ZEPTOMAIL_ENCRYPTION_KEY` is set.
2. **Token cannot be decrypted.** The encryption key changed or the token was
   saved under a different key. Re-enter the token.
3. **`EAI_AGAIN`, `getaddrinfo EAI_AGAIN`, `ENOTFOUND`.** DNS resolution for
   `api.zeptomail.com` is failing on the server/network. This is an environment
   problem, not an application bug. Test with:
   - `nslookup api.zeptomail.com`
   - `curl -I https://api.zeptomail.com`
   - the server's outbound DNS/firewall configuration.
   The contact/enquiry record is still saved; only the mail fails.
4. **`401`/`403` from ZeptoMail.** Token invalid, revoked, or missing the
   `Zoho-enczapikey ` prefix handling (the app normalizes it, so check the token
   itself). Confirm the API endpoint matches the data center that issued the
   token.
5. **`Sender not verified` / `550`.** Verify the sender address/domain in the
   ZeptoMail console.
6. **Reset link opens localhost.** Set `NEXT_PUBLIC_BASE_URL` to the public
   origin and redeploy/restart.
7. **Visitor did not receive a confirmation.** Check spam, the address entered,
   and the server log line for the visitor send. The API logs each send
   separately.
8. **No logs at all.** The submit likely failed validation or rate limiting
   before the send step; check the HTTP response.

Useful log prefixes:

```text
[ZeptoMail]
[Contact API]
[Enquiry API]
[forgot-password]
```

## Operational notes

- Email is best-effort. There is no outbox/retry queue. If ZeptoMail is down,
  the data is in the admin inbox but the visitor confirmation is lost.
- The app sends synchronously inside the request, so a slow ZeptoMail response
  increases form latency. Keep the endpoint timeout reasonable.
- Do not put the token in `NEXT_PUBLIC_*`, logs, screenshots, or the repository.
- Rotate the token in ZeptoMail and in Settings if it is exposed. Changing
  `ZEPTOMAIL_ENCRYPTION_KEY` requires re-entering the token.
