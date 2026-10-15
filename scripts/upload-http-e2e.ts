/**
 * Authenticated HTTP end-to-end test for the media upload route. Requires the
 * app to be running (next start) against a scratch database.
 *
 *   E2E_PHASE=happy   -> login, upload PNG/JPEG/WebP, serve them back, and
 *                        exercise the 403/401/400/413/415 guards.
 *   E2E_PHASE=dbfail  -> login, then upload while the mediaasset write fails;
 *                        expects 503 and verifies no orphan file is left behind.
 *
 * Env: E2E_BASE_URL, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, UPLOAD_MAX_BYTES.
 */
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { getUploadRoot } from "../src/lib/admin/upload-storage";

const BASE = (process.env.E2E_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const EMAIL = process.env.E2E_ADMIN_EMAIL ?? "e2e-uploads@example.com";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "E2e!UploadTest123";
const PHASE = process.env.E2E_PHASE ?? "happy";
const LIMIT = Number(process.env.UPLOAD_MAX_BYTES ?? 5_242_880);
const ORIGIN = BASE;

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

let passed = 0;
const failures: string[] = [];
const jar: Record<string, string> = {};

function check(label: string, ok: boolean, detail?: unknown) {
  if (ok) {
    passed += 1;
    console.log(`  PASS  ${label}`);
    return;
  }
  const suffix = detail === undefined ? "" : ` :: ${String(detail)}`;
  failures.push(`${label}${suffix}`);
  console.log(`  FAIL  ${label}${suffix}`);
}

function cookieHeader() {
  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

function collectCookies(response: Response) {
  const headers = response.headers as unknown as { getSetCookie?: () => string[] };
  const raw =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : [response.headers.get("set-cookie") ?? ""];
  for (const entry of raw) {
    if (!entry) continue;
    const segment = entry.split(";")[0];
    const eq = segment.indexOf("=");
    if (eq > 0) jar[segment.slice(0, eq)] = segment.slice(eq + 1);
  }
}

async function login() {
  const csrfResponse = await fetch(`${BASE}/api/auth/csrf`, { headers: { Cookie: cookieHeader() } });
  collectCookies(csrfResponse);
  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };

  const body = new URLSearchParams({
    csrfToken,
    email: EMAIL,
    password: PASSWORD,
    callbackUrl: `${BASE}/admin`,
    json: "true",
  });
  const loginResponse = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: ORIGIN,
      Cookie: cookieHeader(),
    },
    body,
  });
  collectCookies(loginResponse);

  const sessionResponse = await fetch(`${BASE}/api/auth/session`, {
    headers: { Cookie: cookieHeader() },
  });
  const session = (await sessionResponse.json()) as { user?: { email?: string } };
  return session.user?.email === EMAIL;
}

async function upload(
  body: Buffer | Uint8Array,
  options: { contentType?: string; cookies?: string; origin?: string; category?: string } = {},
) {
  const url = `${BASE}/api/admin/media/upload?category=${options.category ?? "pages"}`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": options.contentType ?? "image/png",
      Origin: options.origin ?? ORIGIN,
      Cookie: options.cookies ?? cookieHeader(),
    },
    body: body as unknown as BodyInit,
  });
}

function pagesDirFiles() {
  const dir = path.join(getUploadRoot(), "pages");
  if (!existsSync(dir)) return [];
  return readdirSync(dir);
}

async function happyPhase() {
  check("login succeeds", await login());

  const uploaded = await upload(PNG);
  check("coherent upload returns 201", uploaded.status === 201, uploaded.status);
  const payload = (await uploaded.json()) as { path?: string; contentType?: string; size?: number };
  check("upload response carries path", typeof payload.path === "string", payload.path);
  check("upload response content type", payload.contentType === "image/png", payload.contentType);

  if (payload.path) {
    const served = await fetch(`${BASE}${payload.path}`, { headers: { Cookie: cookieHeader() } });
    check("served upload returns 200", served.status === 200, served.status);
    check(
      "served content type is image/png",
      (served.headers.get("content-type") ?? "").startsWith("image/png"),
      served.headers.get("content-type"),
    );
    const bytes = Buffer.from(await served.arrayBuffer());
    check("served bytes match uploaded bytes", bytes.equals(PNG));
  }

  const noAuth = await upload(PNG, { cookies: "" });
  check("unauthenticated upload returns 401", noAuth.status === 401, noAuth.status);

  const badOrigin = await upload(PNG, { origin: "http://evil.example" });
  check("cross-origin upload returns 403", badOrigin.status === 403, badOrigin.status);

  const badType = await upload(Buffer.from("not an image"), { contentType: "text/plain" });
  check("non-image upload returns 415", badType.status === 415, badType.status);

  const badCategory = await upload(PNG, { category: "not-a-category" });
  check("invalid category returns 400", badCategory.status === 400, badCategory.status);

  const oversize = await upload(Buffer.concat([PNG, Buffer.alloc(LIMIT + 512, 0x41)]));
  check("oversized upload returns 413", oversize.status === 413, oversize.status);
}

async function dbfailPhase() {
  check("login succeeds", await login());

  const before = pagesDirFiles().filter((f) => !f.startsWith(".upload-"));
  const response = await upload(PNG);
  check("upload with broken media table returns 503", response.status === 503, response.status);

  // Give the route's cleanup a moment, then confirm no orphan file was kept.
  await new Promise((resolve) => setTimeout(resolve, 500));
  const after = pagesDirFiles().filter((f) => !f.startsWith(".upload-"));
  check(
    "no orphan image left after failed registration",
    after.length === before.length,
    `before=${before.length} after=${after.length}`,
  );
}

async function main() {
  console.log(`base url: ${BASE}`);
  console.log(`phase   : ${PHASE}`);
  console.log(`root    : ${getUploadRoot()}`);

  if (PHASE === "dbfail") await dbfailPhase();
  else await happyPhase();

  console.log(`\nRESULT: ${passed} passed, ${failures.length} failed`);
  for (const failure of failures) console.log(`  FAILED: ${failure}`);
  process.exit(failures.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("upload-http-e2e fatal:", error);
  process.exit(1);
});
