import { type Tool, type OutputLine, ok, err } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Claim glossary — friendly name + short description for known JWT claims
// Sources: RFC 7519 (registered claims), OpenID Connect Core, common providers
// ─────────────────────────────────────────────────────────────────────────────
const REGISTERED_CLAIMS: Record<string, string> = {
  iss: "Issuer — who created and signed the token",
  sub: "Subject — the principal the token refers to (usually user id)",
  aud: "Audience — who the token is intended for",
  exp: "Expiration time (epoch seconds)",
  nbf: "Not before (epoch seconds)",
  iat: "Issued at (epoch seconds)",
  jti: "JWT ID — unique identifier for the token",
};

const OIDC_CLAIMS: Record<string, string> = {
  name: "Full display name",
  given_name: "First name",
  family_name: "Last name",
  middle_name: "Middle name",
  nickname: "Casual nickname",
  preferred_username: "Username chosen by the user",
  profile: "Profile page URL",
  picture: "Profile image URL",
  website: "Personal website URL",
  email: "Email address",
  email_verified: "Whether email has been verified",
  gender: "Gender",
  birthdate: "Date of birth",
  zoneinfo: "Timezone (e.g. America/Los_Angeles)",
  locale: "Locale (e.g. en-US)",
  phone_number: "Phone number",
  phone_number_verified: "Whether phone number has been verified",
  address: "Postal address",
  updated_at: "When profile info was last updated",
  azp: "Authorized party — the OAuth client ID the token was issued for",
  nonce: "String to mitigate replay attacks (passed at auth time)",
  auth_time: "When authentication occurred (epoch seconds)",
  acr: "Authentication Context Class Reference",
  amr: "Authentication Methods References (e.g. pwd, mfa)",
  at_hash: "Hash of the access token (ID token only)",
  c_hash: "Hash of the authorization code (ID token only)",
  sid: "Session ID",
};

const OAUTH_CLAIMS: Record<string, string> = {
  scope: "Granted OAuth scopes (space-delimited)",
  scopes: "Granted OAuth scopes (array form)",
  scp: "Granted OAuth scopes (Microsoft variant)",
  client_id: "OAuth client identifier",
  cnf: "Confirmation — proof-of-possession key (e.g. mTLS, DPoP)",
  act: "Actor — for delegation/impersonation tokens",
  may_act: "Authorized actors permitted to act on behalf of subject",
  roles: "Assigned roles",
  groups: "Group memberships",
  permissions: "Granted permissions",
  entitlements: "Entitlements granted to the subject",
};

const VENDOR_CLAIMS: Record<string, string> = {
  // Microsoft Azure AD / Entra ID
  tid: "Tenant ID (Azure AD)",
  oid: "Object ID — stable user identifier (Azure AD)",
  upn: "User Principal Name (Azure AD)",
  unique_name: "Unique name (Azure AD)",
  appid: "Application ID (Azure AD v1)",
  idp: "Identity provider (Azure AD)",
  ipaddr: "IP address of the user (Azure AD)",
  ver: "Token version",
  // AWS Cognito
  "cognito:username": "Cognito username",
  "cognito:groups": "Cognito group memberships",
  token_use: "Cognito token type (id, access, refresh)",
  // Auth0
  "https://auth0.com/email": "Auth0 custom email claim",
  // GitHub
  repository: "GitHub repository (Actions OIDC)",
  workflow: "GitHub workflow name (Actions OIDC)",
  // Generic
  realm_access: "Keycloak realm-level access",
  resource_access: "Keycloak resource-level access",
};

const HEADER_FIELDS: Record<string, string> = {
  alg: "Signing algorithm",
  typ: "Token type (usually JWT)",
  cty: "Content type — set to JWT for nested tokens",
  kid: "Key ID — identifies which signing key was used",
  jku: "JWK Set URL — where to fetch the signing key",
  jwk: "Embedded JSON Web Key",
  x5u: "URL pointing to the X.509 cert chain",
  x5c: "X.509 certificate chain (embedded)",
  x5t: "SHA-1 thumbprint of the X.509 cert",
  "x5t#S256": "SHA-256 thumbprint of the X.509 cert",
  crit: "Critical extensions that must be understood",
  enc: "Content encryption algorithm (JWE)",
  zip: "Compression algorithm (JWE, e.g. DEF)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Algorithm safety classification
// ─────────────────────────────────────────────────────────────────────────────
interface AlgInfo {
  family: "HMAC" | "RSA" | "ECDSA" | "EdDSA" | "RSA-PSS" | "None";
  strength: "secure" | "weak" | "insecure";
  note?: string;
}

const ALG_INFO: Record<string, AlgInfo> = {
  none: { family: "None", strength: "insecure", note: "no signature — vulnerable to forgery" },
  HS256: { family: "HMAC", strength: "secure" },
  HS384: { family: "HMAC", strength: "secure" },
  HS512: { family: "HMAC", strength: "secure" },
  RS256: { family: "RSA", strength: "secure" },
  RS384: { family: "RSA", strength: "secure" },
  RS512: { family: "RSA", strength: "secure" },
  PS256: { family: "RSA-PSS", strength: "secure" },
  PS384: { family: "RSA-PSS", strength: "secure" },
  PS512: { family: "RSA-PSS", strength: "secure" },
  ES256: { family: "ECDSA", strength: "secure" },
  ES384: { family: "ECDSA", strength: "secure" },
  ES512: { family: "ECDSA", strength: "secure" },
  EdDSA: { family: "EdDSA", strength: "secure" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Issuer → provider detection
// ─────────────────────────────────────────────────────────────────────────────
function detectProvider(iss: string): string | undefined {
  if (!iss) return;
  if (/accounts\.google\.com|securetoken\.google\.com/.test(iss)) return "Google";
  if (/\.auth0\.com/.test(iss)) return "Auth0";
  if (/\.okta\.com/.test(iss)) return "Okta";
  if (/login\.microsoftonline\.com|sts\.windows\.net/.test(iss)) return "Microsoft Azure AD / Entra";
  if (/cognito-idp\..*\.amazonaws\.com/.test(iss)) return "AWS Cognito";
  if (/token\.actions\.githubusercontent\.com/.test(iss)) return "GitHub Actions OIDC";
  if (/keycloak/i.test(iss)) return "Keycloak";
  if (/\.firebaseio\.com|firebase/i.test(iss)) return "Firebase";
  if (/appleid\.apple\.com/.test(iss)) return "Apple";
  if (/\.facebook\.com/.test(iss)) return "Facebook";
  if (/login\.salesforce\.com/.test(iss)) return "Salesforce";
  if (/\.zitadel\./.test(iss)) return "Zitadel";
  if (/api\.atlassian\.com/.test(iss)) return "Atlassian";
  return;
}

// ─────────────────────────────────────────────────────────────────────────────
// Token type heuristics
// ─────────────────────────────────────────────────────────────────────────────
function detectTokenType(payload: Record<string, unknown>, header: Record<string, unknown>): string | undefined {
  const typ = typeof header.typ === "string" ? header.typ.toLowerCase() : "";
  if (typ.includes("at+jwt")) return "OAuth 2.0 Access Token (RFC 9068)";
  if (typ.includes("logout+jwt")) return "OIDC Back-Channel Logout Token";
  if (typ.includes("dpop+jwt")) return "DPoP proof token";

  if (payload.token_use === "id") return "ID Token (Cognito)";
  if (payload.token_use === "access") return "Access Token (Cognito)";
  if (payload.token_use === "refresh") return "Refresh Token (Cognito)";

  if ("nonce" in payload && ("at_hash" in payload || "c_hash" in payload)) return "OIDC ID Token";
  if ("scope" in payload || "scp" in payload || "scopes" in payload) return "OAuth Access Token";
  if ("email" in payload && "email_verified" in payload) return "ID Token (likely)";
  return;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function base64UrlDecode(s: string): string {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? padded : padded + "=".repeat(4 - (padded.length % 4));
  const binary = atob(pad);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function fmtEpoch(seconds: number): string {
  const d = new Date(seconds * 1000);
  if (Number.isNaN(d.getTime())) return String(seconds);
  return `${d.toISOString()}  (${d.toLocaleString()})`;
}

function relative(seconds: number): string {
  const diffMs = seconds * 1000 - Date.now();
  const abs = Math.abs(diffMs);
  const units: [number, string][] = [
    [1000, "s"],
    [60_000, "m"],
    [3_600_000, "h"],
    [86_400_000, "d"],
  ];
  let unitMs = 1000;
  let unitName = "s";
  for (const [ms, name] of units) {
    if (abs >= ms) {
      unitMs = ms;
      unitName = name;
    }
  }
  const value = Math.round(abs / unitMs);
  return diffMs > 0 ? `in ${value}${unitName}` : `${value}${unitName} ago`;
}

function fmtDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
  return `${(seconds / 86400).toFixed(1)}d`;
}

function describeClaim(key: string): string | undefined {
  return (
    REGISTERED_CLAIMS[key] ||
    OIDC_CLAIMS[key] ||
    OAUTH_CLAIMS[key] ||
    VENDOR_CLAIMS[key]
  );
}

function isStandardClaim(key: string): boolean {
  return (
    key in REGISTERED_CLAIMS ||
    key in OIDC_CLAIMS ||
    key in OAUTH_CLAIMS ||
    key in VENDOR_CLAIMS
  );
}

function fmtValue(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool definition
// ─────────────────────────────────────────────────────────────────────────────
export const jwtTool: Tool = {
  name: "jwt",
  category: "decode",
  description: "Decode a JSON Web Token: header, claims glossary, expiry, provider, security analysis.",
  usage: "jwt <token>",
  examples: ["jwt eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature"],
  run(args) {
    const token = args.trim();
    if (!token) return err("Missing token.", "Try: jwt <your.jwt.token>");

    const parts = token.split(".");
    if (parts.length !== 3 && parts.length !== 5) {
      return err(
        `Invalid JWT format (expected 3 parts for JWS or 5 for JWE, got ${parts.length}).`,
        "A JWS looks like: <header>.<payload>.<signature>",
      );
    }

    if (parts.length === 5) {
      // JWE — encrypted token. We can only decode the protected header.
      try {
        const header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;
        return ok([
          { text: "encrypted JWT (JWE) detected", kind: "warn" },
          { text: "payload is encrypted — only the protected header can be inspected.", kind: "muted" },
          { text: "header:", kind: "label" },
          { text: JSON.stringify(header, null, 2), kind: "code", copyable: true },
        ]);
      } catch {
        return err("Failed to decode JWE protected header.");
      }
    }

    const [headerPart, payloadPart, signaturePart] = parts;

    let header: Record<string, unknown>;
    let payload: Record<string, unknown>;
    try {
      header = JSON.parse(base64UrlDecode(headerPart));
    } catch {
      return err("Failed to decode JWT header (invalid base64url or JSON).");
    }
    try {
      payload = JSON.parse(base64UrlDecode(payloadPart));
    } catch {
      return err("Failed to decode JWT payload (invalid base64url or JSON).");
    }

    const lines: OutputLine[] = [];

    // ── Token summary ─────────────────────────────────────────────
    const tokenType = detectTokenType(payload, header);
    const issuer = typeof payload.iss === "string" ? payload.iss : undefined;
    const provider = issuer ? detectProvider(issuer) : undefined;
    const tokenBytes = new TextEncoder().encode(token).length;

    lines.push({ text: "summary:", kind: "label" });
    if (tokenType) lines.push({ text: `type: ${tokenType}`, kind: "info" });
    if (provider) lines.push({ text: `issuer: ${provider}`, kind: "info" });
    lines.push({
      text: `size: ${tokenBytes} bytes${tokenBytes > 8192 ? "  ⚠ large (>8KB) — may exceed header limits" : ""}`,
      kind: tokenBytes > 8192 ? "warn" : "muted",
    });

    // ── Header ────────────────────────────────────────────────────
    lines.push({ text: "header:", kind: "label" });
    lines.push({ text: JSON.stringify(header, null, 2), kind: "code", copyable: true });

    const headerNotes: OutputLine[] = [];
    for (const [key, value] of Object.entries(header)) {
      const desc = HEADER_FIELDS[key];
      if (desc) headerNotes.push({ text: `  ${key}: ${desc}`, kind: "muted" });
    }
    if (headerNotes.length > 0) {
      lines.push({ text: "header fields:", kind: "label" });
      lines.push(...headerNotes);
    }

    // ── Payload ───────────────────────────────────────────────────
    lines.push({ text: "payload:", kind: "label" });
    lines.push({ text: JSON.stringify(payload, null, 2), kind: "code", copyable: true });

    // ── Claim glossary (only known/standard claims) ───────────────
    const standardClaims: OutputLine[] = [];
    const customClaims: string[] = [];
    for (const key of Object.keys(payload)) {
      const desc = describeClaim(key);
      if (desc) {
        const value = payload[key];
        const formatted = fmtValue(value);
        const truncated = formatted.length > 80 ? formatted.slice(0, 77) + "…" : formatted;
        standardClaims.push({
          text: `  ${key}: ${truncated}`,
          kind: "default",
        });
        standardClaims.push({ text: `      ${desc}`, kind: "muted" });
      } else {
        customClaims.push(key);
      }
    }
    if (standardClaims.length > 0) {
      lines.push({ text: "claims (standard):", kind: "label" });
      lines.push(...standardClaims);
    }
    if (customClaims.length > 0) {
      lines.push({ text: "claims (custom / unrecognized):", kind: "label" });
      lines.push({
        text: `  ${customClaims.join(", ")}`,
        kind: "muted",
      });
    }

    // ── Time analysis ─────────────────────────────────────────────
    const exp = typeof payload.exp === "number" ? payload.exp : undefined;
    const iat = typeof payload.iat === "number" ? payload.iat : undefined;
    const nbf = typeof payload.nbf === "number" ? payload.nbf : undefined;
    const auth_time = typeof payload.auth_time === "number" ? payload.auth_time : undefined;

    if (exp !== undefined || iat !== undefined || nbf !== undefined) {
      lines.push({ text: "timing:", kind: "label" });
      if (iat !== undefined) {
        lines.push({ text: `  issued:    ${fmtEpoch(iat)}  (${relative(iat)})`, kind: "muted" });
      }
      if (auth_time !== undefined) {
        lines.push({ text: `  auth_time: ${fmtEpoch(auth_time)}  (${relative(auth_time)})`, kind: "muted" });
      }
      if (nbf !== undefined) {
        const notYetValid = nbf * 1000 > Date.now();
        lines.push({
          text: `  not before: ${fmtEpoch(nbf)}  (${relative(nbf)})`,
          kind: notYetValid ? "warn" : "muted",
        });
        if (notYetValid) lines.push({ text: "  ⚠ token is not yet valid (nbf in future)", kind: "warn" });
      }
      if (exp !== undefined) {
        const expired = exp * 1000 < Date.now();
        lines.push({
          text: `  expires:   ${fmtEpoch(exp)}  (${relative(exp)})`,
          kind: expired ? "error" : "success",
        });
        if (iat !== undefined) {
          lines.push({
            text: `  lifetime:  ${fmtDuration(exp - iat)}`,
            kind: "muted",
          });
        }
        lines.push({
          text: expired ? "  status: EXPIRED" : "  status: valid (not expired)",
          kind: expired ? "error" : "success",
        });
      }
    }

    // ── Scopes / permissions ──────────────────────────────────────
    const scopeRaw = payload.scope ?? payload.scp ?? payload.scopes;
    if (scopeRaw !== undefined) {
      const scopes =
        typeof scopeRaw === "string"
          ? scopeRaw.split(/\s+/).filter(Boolean)
          : Array.isArray(scopeRaw)
            ? scopeRaw.map(String)
            : [];
      if (scopes.length > 0) {
        lines.push({ text: `scopes (${scopes.length}):`, kind: "label" });
        for (const s of scopes) lines.push({ text: `  • ${s}`, kind: "default" });
      }
    }

    // ── Algorithm / security analysis ─────────────────────────────
    const alg = typeof header.alg === "string" ? header.alg : undefined;
    if (alg) {
      lines.push({ text: "security:", kind: "label" });
      const info = ALG_INFO[alg];
      if (!info) {
        lines.push({ text: `  alg: ${alg} — unknown algorithm`, kind: "warn" });
      } else {
        const kindMap: Record<AlgInfo["strength"], OutputLine["kind"]> = {
          secure: "success",
          weak: "warn",
          insecure: "error",
        };
        lines.push({
          text: `  alg: ${alg} (${info.family}) — ${info.strength}${info.note ? "  ⚠ " + info.note : ""}`,
          kind: kindMap[info.strength],
        });
        if (info.family === "HMAC") {
          lines.push({
            text: "  note: HS* uses a shared secret — verify the secret isn't a public RSA key (algorithm confusion attack).",
            kind: "muted",
          });
        }
      }
    }

    // ── Signature ─────────────────────────────────────────────────
    lines.push({ text: "signature:", kind: "label" });
    const sigPreview = signaturePart.length > 64 ? signaturePart.slice(0, 32) + "…" + signaturePart.slice(-16) : signaturePart;
    lines.push({
      text: `  ${sigPreview}  (${signaturePart.length} chars)`,
      kind: "muted",
    });
    lines.push({
      text: "  note: signature is not verified — this tool only decodes.",
      kind: "muted",
    });

    return ok(lines);
  },
};
