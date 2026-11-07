// Verifies the Supabase access token sent by the browser.
// Supports a project's JWT secret (HS256) or, if none is set, the project's public signing keys (JWKS).
import { jwtVerify, createRemoteJWKSet } from "jose";

export function createVerifier(env = process.env) {
  const devAuth = env.DEV_FAKE_AUTH === "1" && env.NODE_ENV !== "production";
  let jwks = null;
  const secret = env.SUPABASE_JWT_SECRET ? new TextEncoder().encode(env.SUPABASE_JWT_SECRET) : null;
  if (!secret && env.SUPABASE_URL) jwks = createRemoteJWKSet(new URL("/auth/v1/.well-known/jwks.json", env.SUPABASE_URL));

  return async function verifyToken(token) {
    if (!token) return null;
    // Local development only: "dev:<id>:<email>" signs you in without Supabase.
    if (devAuth && token.startsWith("dev:")) {
      const [, id, email] = token.split(":");
      if (!id) return null;
      return { id: "dev-" + id.replace(/[^a-z0-9_-]/gi, "").slice(0, 40), email: email || `${id}@example.com`, name: id };
    }
    const key = secret || jwks;
    if (!key) return null;
    try {
      const { payload } = await jwtVerify(token, key, { audience: "authenticated" });
      if (!payload.sub) return null;
      const meta = payload.user_metadata || {};
      return { id: String(payload.sub), email: payload.email || "", name: meta.full_name || meta.name || "" };
    } catch {
      return null;
    }
  };
}
