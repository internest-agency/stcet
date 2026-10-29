# Security Audit Report - STCET Website

**Report Date:** 2026-10-28  
**Target:** STCET (https://github.com/YourRepo/stcet) - Next.js 16 Application  
**Audit Type:** Defensive Security Review (Codebase Analysis)  
**Scope:** Local project source code, API routes, authentication, database configuration, file uploads, and security controls  

---

## Executive Summary

This is a defensive security audit of the STCET college website - a Next.js 16 application using TypeScript, Prisma with MariaDB, NextAuth for admin authentication, and various API endpoints for contact forms and content management. 

**Overall Risk Rating:** **MEDIUM-HIGH** 

The application has several good security practices in place (rate limiting on auth, input validation, same-origin checks on uploads, secure password handling patterns), but there are notable security concerns that need attention, particularly around configuration, error handling, and security headers.

---

## Scope & Methodology

- **Reviewed:** Source code in `src/`, configuration files (`next.config.ts`, `package.json`, `.env.example`), API routes, authentication/authorization logic, database access patterns, file upload handling
- **Standards Applied:** OWASP Top 10 2021, OWASP API Security Top 10 2023, secure coding practices
- **Approach:** Static code analysis, configuration review, pattern identification

---

## Key Findings Summary

| Severity | Count | Category |
| --- | --- | --- |
| **CRITICAL** | 0 | - |
| **HIGH** | 3 | Configuration, Error Disclosure, Missing Security Headers |
| **MEDIUM** | 6 | Input Validation, Rate Limiting, CORS/Same-Origin, Session Security |
| **LOW** | 5 | Information Disclosure, Best Practices |
| **INFO** | 4 | Observations, Recommendations |

---

## HIGH Severity Findings

### H-01: Missing Security Headers in Next.js Configuration
**Status:** Confirmed | **Severity:** HIGH | **Category:** Security Misconfiguration (OWASP A05:2021)

**Affected Surface:** `next.config.ts`, all HTTP responses

**Evidence:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 2,
  },
  async redirects() {
    return [
      {
        source: "/admin/pages",
        destination: "/admin/institutional-pages",
        permanent: false,
      },
      {
        source: "/news-and-events",
        destination: "/events",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

**Risk:** No security headers configured (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). Application is vulnerable to clickjacking, MIME sniffing, XSS, and other client-side attacks.

**Impact:** Medium-High - Exploitation depends on specific pages/components

**Remediation:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 2,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/admin/pages",
        destination: "/admin/institutional-pages",
        permanent: false,
      },
      {
        source: "/news-and-events",
        destination: "/events",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

**Note:** CSP needs to be tuned based on actual third-party scripts used (Google Analytics, fonts, etc.). Consider using nonces for inline scripts where possible.

---

### H-02: Potential Information Disclosure in Error Messages
**Status:** Confirmed | **Severity:** HIGH | **Category:** Information Exposure (OWASP A01:2021)

**Affected Surface:** Multiple API routes

**Evidence:**
- `src/app/api/contact/route.ts` line ~290: `console.error("STCET contact API error:", error);` - logs full error objects
- `src/app/api/health/database/route.ts` catches errors silently with empty catch block
- `src/app/api/admin/media/upload/route.ts` has detailed error logging with `describeError()` function

**Risk:** Detailed error messages in logs could expose stack traces, database structure, file paths. While logs aren't directly accessible to users, they pose risk if logs are compromised or in certain environments.

**Impact:** Medium - Depends on logging infrastructure and access controls

**Remediation:**
- Avoid logging full error objects in production; log error IDs and minimal context
- Use structured logging with log levels
- Ensure logs are not publicly accessible
- In production, return generic error messages to clients (already done in most places)
- Consider using a proper logging service

---

### H-03: Insufficient Rate Limiting on Public API Endpoints
**Status:** Confirmed | **Severity:** HIGH | **Category:** Broken Access Control / Lack of Resources & Rate Limiting (OWASP API4:2023)

**Affected Surface:** `src/app/api/contact/route.ts`, `src/app/api/enquiry/route.ts`

**Evidence:**
```typescript
// Contact API has duplicate check (2 minutes) by email
const recentWindow = new Date(Date.now() - 2 * 60 * 1000);
const existingRecent = await prisma.contactMessage.findFirst({
  where: {
    email,
    createdAt: {
      gte: recentWindow,
    },
  },
  ...
});
```

**Issues:**
1. Only checks by email, can be bypassed with different emails
2. Only 2-minute window, no daily/hourly limits
3. No IP-based rate limiting
4. No CAPTCHA or bot protection
5. Enquiry endpoint likely has similar or weaker protection

**Risk:** Spam, email bombing, resource exhaustion, potential for DoS

**Impact:** High - Could lead to service degradation and abuse

**Remediation:**
- Implement IP-based rate limiting (Redis/Upstash or in-memory with distributed consideration)
- Add per-IP and per-email limits (e.g., 5 per hour per IP)
- Consider adding CAPTCHA (hCaptcha/reCAPTCHA) for public forms
- Implement honeypot fields
- Add stricter validation and blocking of suspicious patterns

---

## MEDIUM Severity Findings

### M-01: Session Security Configuration
**Status:** Confirmed | **Severity:** MEDIUM | **Category:** Authentication (OWASP A07:2021)

**Affected Surface:** `src/lib/admin/auth-options.ts`

**Evidence:**
```typescript
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  ...
};
```

**Issues:**
1. JWT strategy without explicit httpOnly/Secure/SameSite cookie configuration visible
2. 8-hour session might be long for admin access
3. No `updateAge` or rotation strategy specified
4. No explicit `jwt` maxAge different from session
5. NextAuth defaults may need review

**Risk:** Session hijacking if cookies not properly secured

**Remediation:**
```typescript
session: { 
  strategy: "jwt", 
  maxAge: 4 * 60 * 60, // 4 hours instead of 8
  updateAge: 60 * 60, // update session every hour
},
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    }
  }
}
```

Also ensure NEXTAUTH_SECRET is strong (32+ bytes) in production.

---

### M-02: File Upload Security - Same-Origin Check Bypass Potential
**Status:** Confirmed | **Severity:** MEDIUM | **Category:** Unrestricted File Upload / CSRF-like issues (OWASP A04:2021)

**Affected Surface:** `src/app/api/admin/media/upload/route.ts`

**Evidence:**
```typescript
function isSameOrigin(request: Request) {
  const originHeader = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
    new URL(request.url).protocol.slice(0, -1);

  if (!originHeader || !host) return false;

  try {
    const origin = new URL(originHeader);
    return (
      origin.host.toLowerCase() === host.toLowerCase() &&
      origin.protocol === `${protocol}:`
    );
  } catch {
    return false;
  }
}
```

**Issues:**
1. Relies on Origin header which can be absent in some requests (same-site requests in older browsers, or certain clients)
2. Behind proxies, `x-forwarded-*` headers must be trusted - if app is not behind trusted proxy, they can be spoofed
3. Returns false if headers missing (blocks legitimate requests in some cases) but logic needs validation
4. No CSRF token as additional protection

**Risk:** CSRF attacks if check can be bypassed or misconfigured

**Remediation:**
- Ensure app is behind trusted proxy and validate proxy headers properly
- Add CSRF token validation (double-submit cookie or synchronizer token pattern)
- Consider using Next.js built-in CSRF protections or libraries like `csrf`
- Log and monitor failed origin checks

---

### M-03: Database Connection Configuration Exposes Details
**Status:** Confirmed | **Severity:** MEDIUM | **Category:** Security Misconfiguration

**Affected Surface:** `src/lib/prisma-client.ts`

**Evidence:**
```typescript
function reportDatabaseError(error: unknown) {
  const signature = summarizeDatabaseError(error);
  const now = Date.now();

  if (
    lastDatabaseError?.signature === signature &&
    now - lastDatabaseError.loggedAt < DATABASE_ERROR_LOG_INTERVAL_MS
  ) {
    return;
  }

  lastDatabaseError = { signature, loggedAt: now };
  console.error(`[prisma] database connection error: ${signature}`);
}
```

**Issues:**
1. Logs database errors which might contain connection details
2. Error messages from MySQL can reveal schema information in some cases
3. In production, these logs need to be properly secured

**Risk:** Information leakage through logs

**Remediation:**
- Sanitize database error messages more aggressively
- Use different log levels
- Ensure log aggregation is secure
- Consider not logging sensitive connection parameters

---

### M-04: Admin Login Brute Force Protection Could Be Improved
**Status:** Confirmed | **Severity:** MEDIUM | **Category:** Authentication (OWASP A07:2021)

**Affected Surface:** `src/lib/admin/auth-options.ts`

**Evidence:**
```typescript
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

async function recordFailedAttempt(emailHash: string, now: Date) {
  const prisma = getPrismaClient();
  const cutoff = new Date(now.getTime() - ATTEMPT_WINDOW_MS);

  await prisma.$transaction(async (transaction) => {
    const previous = await transaction.adminLoginAttempt.findUnique({
      where: { emailHash },
    });

    if (!previous || previous.windowStartedAt <= cutoff) {
      await transaction.adminLoginAttempt.upsert({
        where: { emailHash },
        create: { emailHash, attempts: 1, windowStartedAt: now },
        update: { attempts: 1, windowStartedAt: now, blockedUntil: null },
      });
      return;
    }

    if (previous.blockedUntil && previous.blockedUntil > now) return;

    const attempts = previous.attempts + 1;
    await transaction.adminLoginAttempt.update({
      where: { emailHash },
      data: {
        attempts,
        blockedUntil:
          attempts >= MAX_ATTEMPTS
            ? new Date(now.getTime() + ATTEMPT_WINDOW_MS)
            : null,
      },
    });
  });
}
```

**Good:** Uses email hash (SHA256 with secret), has windowing, transaction-based updates
**Issues:**
1. Only tracks by email hash - attacker can try many emails from same IP
2. No IP-based tracking
3. 5 attempts in 15 minutes is moderate but could be tighter
4. Block is time-based but no permanent blocking for distributed attacks
5. No alerting mechanism

**Remediation:**
- Add IP-based rate limiting as well
- Consider implementing exponential backoff
- Add account lockout after repeated failures across different patterns
- Implement CAPTCHA after N failed attempts
- Log suspicious login patterns

---

### M-05: Input Validation in Contact/Enquiry Forms
**Status:** Confirmed | **Severity:** MEDIUM | **Category:** Injection (OWASP A03:2021)

**Affected Surface:** `src/app/api/contact/route.ts`

**Evidence:**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return NextResponse.json(
    {
      success: false,
      message: "Please enter a valid email address.",
    },
    {
      status: 400,
    },
  );
}

const cleanPhone = phone.replace(/\D/g, "");
if (cleanPhone.length < 10 || cleanPhone.length > 15) {
  return NextResponse.json(
    {
      success: false,
      message: "Please enter a valid phone number (10 to 15 digits).",
    },
    {
      status: 400,
    },
  );
}

if (message.length < 5) {
  return NextResponse.json(
    {
      success: false,
      message: "Message must be at least 5 characters long.",
    },
    {
      status: 400,
    },
  );
}
```

**Issues:**
1. Email regex is simple - doesn't catch all valid emails but also could be bypassed in edge cases
2. No maximum length validation on name, subject, message
3. No sanitization for potential XSS in stored data (though Prisma with parameterized queries prevents SQL injection)
4. Phone validation is basic
5. No protection against HTML/script injection in messages

**Risk:** XSS if messages are rendered without proper escaping in admin interface

**Remediation:**
- Add max length limits (e.g., name: 100, subject: 200, message: 5000)
- Use a more robust email validation library or Zod schema
- Sanitize inputs or ensure proper escaping on output (React escapes by default, but verify)
- Consider using DOMPurify if rendering HTML
- Add validation for special characters if needed

---

### M-06: Missing CORS Configuration
**Status:** Confirmed | **Severity:** MEDIUM | **Category:** Security Misconfiguration

**Affected Surface:** API routes - no explicit CORS headers

**Evidence:** No CORS configuration found in API routes or middleware

**Risk:** If APIs are called from different origins, browser may block or allow based on defaults. No explicit policy could lead to unintended access.

**Remediation:**
Add CORS configuration for API routes:
```typescript
// In API routes or middleware
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://stcet.ac.in',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

For same-origin only usage (forms on same site), this may not be critical, but explicit policy is better.

---

## LOW Severity Findings

### L-01: Console Logging in Production Code
**Status:** Confirmed | **Severity:** LOW | **Category:** Information Leakage

**Affected Surface:** Multiple files with `console.error`, `console.log`

**Examples:**
- `src/app/api/contact/route.ts`: console.error statements
- `src/lib/prisma-client.ts`: console.error for DB errors
- `src/app/api/admin/media/upload/route.ts`: console.error statements

**Risk:** Logs may contain sensitive information in production

**Remediation:** Replace with proper logging framework (winston, pino) with log levels and redaction

---

### L-02: Environment Variable Exposure in .env.example
**Status:** Confirmed | **Severity:** LOW | **Category:** Information Disclosure

**Affected Surface:** `.env.example`

**Evidence:** Contains example values and comments, which is fine, but ensure no real secrets are committed

**Risk:** Low if example values only

**Remediation:** Ensure `.env` is in `.gitignore` (it is - checked earlier), never commit real secrets

---

### L-03: Health Check Endpoint Information Disclosure
**Status:** Confirmed | **Severity:** LOW | **Category:** Information Disclosure

**Affected Surface:** `src/app/api/health/database/route.ts`

**Evidence:**
```typescript
export async function GET() {
  if (!isDatabaseConfigured()) {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await getPrismaClient().$queryRaw`SELECT 1`;

    return Response.json(
      { status: "ok" },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
```

**Issues:**
- Reveals database configuration status
- Can be used for reconnaissance
- No rate limiting

**Remediation:** Consider restricting health endpoints to internal IPs or removing in production, or adding authentication

---

### L-04: Missing Content Security Policy
**Status:** Confirmed | **Severity:** LOW | **Category:** Missing Security Control (covered in H-01)

Already noted in H-01

---

### L-05: Dependencies - Need Regular Auditing
**Status:** Needs Validation | **Severity:** LOW | **Category:** Vulnerable Components (OWASP A06:2021)

**Affected Surface:** `package.json`

**Dependencies noted:**
- Next.js 16.4.1 (latest)
- Prisma 7.10.0
- NextAuth 4.24.15
- Other dependencies

**Recommendation:** Run `npm audit` regularly and keep dependencies updated

---

## POSITIVE Security Practices Observed

### Good Practices
1. **Authentication Security**
   - Password verification in separate module (`verifyAdminPassword`) - good separation
   - Session versioning for invalidation
   - Account lockout mechanism with hashed emails
   - JWT-based sessions with reasonable expiration
   - Admin authorization checks on protected routes

2. **Database Security**
   - Uses Prisma ORM (parameterized queries, prevents SQL injection)
   - Server-only guards on sensitive modules
   - Connection pooling with proper configuration
   - Schema revision tracking to handle client staleness

3. **File Upload Security**
   - Authentication required
   - Same-origin check
   - File type validation
   - Size limits
   - Category validation
   - Cleanup of unregistered uploads on failure
   - Stores metadata in database

4. **API Security**
   - Input validation on contact forms
   - Duplicate submission prevention
   - Database configuration checks
   - Proper HTTP status codes
   - Non-blocking email notifications (fire-and-forget)
   - IP tracking for contact messages

5. **Configuration**
   - Sensitive modules marked with `server-only`
   - Environment variables used for secrets
   - `.env` in `.gitignore`
   - Proper error handling structure

---

## Recommendations Priority Matrix

| Priority | Action | Effort | Impact |
| --- | --- | --- | --- |
| **P0** | Add security headers to next.config.ts (H-01) | Low | High |
| **P0** | Implement rate limiting on public APIs (H-03) | Medium | High |
| **P1** | Improve error logging/redaction (H-02) | Medium | Medium-High |
| **P1** | Strengthen session security config (M-01) | Low | Medium |
| **P1** | Enhance upload CSRF protection (M-02) | Medium | Medium |
| **P2** | Improve brute force protection (M-04) | Medium | Medium |
| **P2** | Add input length limits & better validation (M-05) | Low | Medium |
| **P2** | Configure CORS explicitly (M-06) | Low | Medium |

---

## Testing Recommendations

### Manual Testing
1. **Authentication:** Test brute force protection, session timeout, privilege escalation
2. **File Upload:** Test file type bypass, size limit bypass, path traversal
3. **API Endpoints:** Test rate limiting, input validation, authorization
4. **Headers:** Check security headers in production

### Automated Testing
1. Run `npm audit` for dependency vulnerabilities
2. Use OWASP ZAP or similar for DAST scanning (on staging/authorized environment)
3. Run SAST tools like Semgrep
4. Check for secrets in codebase with tools like gitleaks

---

## Compliance Notes

- **OWASP Top 10 2021 Coverage:** Addresses most categories but security headers and rate limiting need improvement
- **Data Protection:** Contact form collects PII (name, email, phone) - ensure proper data handling, retention policy, and privacy compliance
- **Authentication:** Admin area properly protected with role-based access control

---

## Conclusion

The STCET application demonstrates solid security fundamentals in authentication, database access, and input handling. The primary weaknesses are in **defense-in-depth measures** - missing security headers, inadequate rate limiting on public endpoints, and some configuration hardening opportunities. 

**Recommended immediate actions:**
1. Add comprehensive security headers
2. Implement robust rate limiting on contact/enquiry forms
3. Review and harden session configuration

With these fixes, the security posture would improve significantly from MEDIUM-HIGH to MEDIUM-LOW risk.

---

**Report Prepared By:** Security Audit Skill  
**Review Status:** Defensive analysis of source code only - no active exploitation performed  
**Note:** This audit is based on static code analysis. A full assessment should include runtime testing on staging environments with proper authorization.
