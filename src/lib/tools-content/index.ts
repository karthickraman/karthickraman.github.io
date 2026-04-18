// ─────────────────────────────────────────────────────────────────────────────
// Per-tool content metadata used by the public /tools/<slug> SEO pages.
// Each entry feeds: <title>, <meta description>, JSON-LD, breadcrumbs,
// pre-filled widget input, and the static About/Examples/FAQ sections that
// give crawlers something to chew on without JS.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";

export interface ToolExample {
  title: string;
  input: string;
  description?: string;
}

export interface FAQEntry {
  q: string;
  a: string;
}

export interface ToolContent {
  /** URL slug under /tools/ */
  slug: string;
  /** Maps to Tool.name in src/lib/devtools/registry.ts */
  toolName: string;
  pageTitle: string;
  pageDescription: string;
  h1: string;
  tagline: string;
  /** Pre-filled into the widget on first load */
  defaultInput: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputRows: number;
  /** Short hero blurb shown above the widget (1–2 sentences) */
  hero: string;
  /** About paragraphs (rendered as <p>). Aim for 250–400 words combined. */
  about: string[];
  examples: ToolExample[];
  faq: FAQEntry[];
  /** Slugs of related tools to cross-link */
  related: string[];
  keywords: string[];
}

export const TOOLS_CONTENT: ToolContent[] = [
  // ── JWT decoder ────────────────────────────────────────────────────────────
  {
    slug: "jwt-decoder",
    toolName: "jwt",
    pageTitle: "JWT Decoder — Inspect JSON Web Tokens Online",
    pageDescription:
      "Decode any JSON Web Token in your browser. See the header, every standard claim with a friendly description, expiry status, issuer, scopes, and algorithm security notes. Nothing is sent to a server.",
    h1: "JWT Decoder",
    tagline: "Header, claims, expiry, issuer and security analysis — all in your browser.",
    inputLabel: "Paste a JWT (header.payload.signature)",
    inputPlaceholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0In0.signature",
    inputRows: 5,
    defaultInput:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkthcnRoaWNrIFAiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.dGVzdC1zaWduYXR1cmU",
    hero:
      "Paste any JSON Web Token to see its header, decoded claims, expiry, issuer, scopes, and an algorithm-safety verdict. Everything runs locally in your browser — the token never leaves your machine.",
    about: [
      "A JSON Web Token (JWT) is a compact, URL-safe way to transmit signed claims between parties. It is the de-facto identity and authorization token for OpenID Connect, OAuth 2.0, AWS Cognito, Azure AD / Entra, Auth0, Okta, Firebase, and most modern API gateways. Although a JWT looks like opaque gibberish, the first two segments are simply Base64URL-encoded JSON and can be inspected without a key.",
      "This decoder splits the token into its three parts (header, payload, signature), decodes the JSON, then enriches the output with a glossary of every standard claim defined in RFC 7519, OpenID Connect Core, OAuth 2.0, and common provider extensions. It detects the issuer (Google, Auth0, Okta, Cognito, Entra, GitHub Actions OIDC, Keycloak, Apple, Firebase, etc.), identifies the token type (ID, access, refresh, DPoP, logout), summarises the algorithm family and its security posture, and converts every epoch timestamp into both ISO-8601 and a human-readable “in 14 minutes” style.",
      "A JWT decoder does not verify the signature — verification requires the issuer’s public key. This tool is intentionally read-only and runs entirely in your browser, which means you can safely inspect production tokens without leaking them to a third-party server. If you need to verify a token, fetch the issuer’s JWKS endpoint and use a server-side library such as jose, jsonwebtoken, or your platform’s built-in JWT support.",
    ],
    examples: [
      {
        title: "A standard HS256 token",
        input:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkthcnRoaWNrIFAiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.dGVzdC1zaWduYXR1cmU",
        description: "Shows the header, decoded claims, expiry status, and HMAC algorithm verdict.",
      },
      {
        title: "An expired token",
        input:
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMzYwMH0.signature",
        description: "Detects Google as the issuer and flags the token as EXPIRED.",
      },
      {
        title: "Token with the dangerous alg=none header",
        input:
          "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjMifQ.",
        description: "Marks the algorithm insecure and explains why alg=none is forgery-prone.",
      },
    ],
    faq: [
      {
        q: "Is my JWT data safe? Do you log tokens?",
        a: "Yes, your data is safe. The decoder is 100% client-side JavaScript — your token is never transmitted, logged, or persisted anywhere. The site is a static export served by GitHub Pages with no backend.",
      },
      {
        q: "Does this verify the JWT signature?",
        a: "No. Signature verification requires the issuer’s public key (or the shared HMAC secret). This tool only decodes and analyses the header and payload, which is what most debugging and inspection tasks need.",
      },
      {
        q: "What is the difference between a JWS and a JWE?",
        a: "A JWS (JSON Web Signature) has 3 dot-separated parts and a readable payload. A JWE (JSON Web Encryption) has 5 parts and an encrypted payload — only the protected header can be inspected without the recipient’s key. The decoder handles both cases.",
      },
      {
        q: "Why is my token marked EXPIRED?",
        a: "The exp claim is in the past. Compare the “expires” line to your local time. If you’re testing, generate a fresh token or set exp far in the future. ID tokens typically live 5–60 minutes; access tokens 15 minutes to 1 hour.",
      },
      {
        q: "What does it mean when alg=none is flagged insecure?",
        a: "alg=none means the token has no signature, so anyone can forge one. It exists in the spec for testing and should never be accepted by a production verifier. Some libraries had CVEs in the past where attackers exploited this.",
      },
      {
        q: "Why are some claims labelled “custom / unrecognized”?",
        a: "Issuers may add their own private claims (for example tenant IDs or feature flags). Anything not in the standard glossary is grouped here so you can spot what’s vendor-specific.",
      },
    ],
    related: ["base64", "epoch-converter", "json-formatter"],
    keywords: ["jwt decoder", "jwt parser", "json web token", "decode jwt online", "oauth", "oidc"],
  },

  // ── Base64 ─────────────────────────────────────────────────────────────────
  {
    slug: "base64",
    toolName: "base64",
    pageTitle: "Base64 Encoder & Decoder Online",
    pageDescription:
      "Encode text to Base64 or decode Base64 back to UTF-8 instantly. Auto-detects direction, supports unicode and arbitrary input. Runs entirely in your browser.",
    h1: "Base64 Encoder / Decoder",
    tagline: "Auto-detects whether to encode or decode. UTF-8 safe.",
    inputLabel: "Text or Base64 string",
    inputPlaceholder: "hello world  —or—  aGVsbG8gd29ybGQ=",
    inputRows: 4,
    defaultInput: "hello world",
    hero:
      "Type any text or paste a Base64 blob — this tool figures out which way to convert and gives you a copy-ready result. UTF-8 safe, works on emoji, and never sends your input anywhere.",
    about: [
      "Base64 is a binary-to-text encoding scheme that represents arbitrary bytes using only 64 printable ASCII characters (A–Z, a–z, 0–9, +, /, with = as padding). It is the lingua franca for embedding binary data into text-only mediums: HTTP basic-auth credentials, data URIs, JWT segments, X.509 certificates, email attachments (MIME), and most JSON/YAML payloads that need to ship a binary blob.",
      "The encoder accepts arbitrary UTF-8 — including emoji, CJK characters, and anything with combining marks — and produces standard padded Base64. The decoder uses a fatal UTF-8 decoder so you’ll see an error rather than silent mojibake if the input isn’t valid text. Direction is auto-detected: if your input only contains the Base64 alphabet and is a multiple of four characters, it is decoded; otherwise it is encoded. You can force direction by prefixing the input with “encode” or “decode”.",
      "Base64 is not encryption. It is reversible by anyone, so never use it to hide secrets — it is only an encoding. A useful mental model: Base64 inflates 3 bytes into 4 ASCII characters, so the encoded form is roughly 33% larger than the input. For URL-safe variants (used in JWT and many web APIs), characters + and / are replaced by - and _, and padding may be omitted.",
    ],
    examples: [
      {
        title: "Encode plain text",
        input: "hello world",
        description: "Produces aGVsbG8gd29ybGQ=",
      },
      {
        title: "Decode a Base64 string",
        input: "aGVsbG8gd29ybGQ=",
        description: "Auto-detects and returns hello world.",
      },
      {
        title: "Encode emoji / unicode",
        input: "encode 🎉 launch day",
        description: "UTF-8 safe — works with any printable text.",
      },
      {
        title: "Force decode mode",
        input: "decode S2FydGhpY2sgUA==",
        description: "Useful when the input would otherwise look like plain text.",
      },
    ],
    faq: [
      {
        q: "Is Base64 encryption?",
        a: "No. Base64 is encoding, not encryption. Anyone can reverse it. Never use it to hide passwords or secrets — use real cryptography (AES, age, libsodium, etc.).",
      },
      {
        q: "Does this handle UTF-8 / emoji / unicode?",
        a: "Yes. The tool uses TextEncoder/TextDecoder under the hood, so any valid UTF-8 string round-trips correctly, including emoji and bidirectional scripts.",
      },
      {
        q: "What is the difference between Base64 and Base64URL?",
        a: "Base64URL replaces + with - and / with _ and may drop = padding. It is used in JWTs, JWKs, and URL-safe contexts where + and / would need percent-encoding.",
      },
      {
        q: "Is anything sent to a server?",
        a: "No. This is a client-side tool — your input stays on your device.",
      },
      {
        q: "How big does Base64 make the data?",
        a: "Roughly 33% larger than the input (every 3 bytes become 4 ASCII characters), plus up to 2 bytes of padding.",
      },
    ],
    related: ["jwt-decoder", "json-formatter", "user-agent-parser"],
    keywords: ["base64 encoder", "base64 decoder", "base64 online", "encode utf8", "data uri"],
  },

  // ── JSON formatter ─────────────────────────────────────────────────────────
  {
    slug: "json-formatter",
    toolName: "json",
    pageTitle: "JSON Formatter, Validator & Sorter",
    pageDescription:
      "Pretty-print, minify, sort, and validate JSON in your browser. Pinpoints parse errors with the exact line and column. Handles deeply nested objects and large payloads.",
    h1: "JSON Formatter",
    tagline: "Pretty-print, minify, sort keys, and pinpoint parse errors with line + column.",
    inputLabel: "Paste JSON",
    inputPlaceholder: '{"name": "karthick", "skills": ["java", "go"]}',
    inputRows: 8,
    defaultInput:
      '{"name":"karthick","role":"backend engineer","skills":["java","go","kafka"],"active":true,"projects":42}',
    hero:
      "Paste any JSON to pretty-print it, minify it, or sort the keys alphabetically. If the JSON is invalid, you get the exact line and column of the parse error.",
    about: [
      "JSON (JavaScript Object Notation) is the ubiquitous data format for REST APIs, configuration files, log records, and inter-service messaging. Despite its simplicity, it’s common to receive JSON that is one giant minified line, has inconsistent key ordering, or contains a sneaky trailing comma that breaks strict parsers. This formatter handles all three cases without requiring you to leave the browser.",
      "The widget runs three operations: pretty-print (default 2-space indentation), minify (collapses to a single line — useful for embedding in code), and sort (alphabetises object keys recursively, which makes diffing two API responses trivial). Validation uses the browser’s built-in JSON.parse, so the parsing rules match what your application will see at runtime. When parsing fails, the tool extracts the byte position from the error message and shows the offending line with a caret pointing at the column.",
      "Because the work happens in your browser, there is no upload limit beyond what your tab can hold in memory — comfortably tens of megabytes on a desktop. The tool also reports the byte size of the formatted output and the type of the root value (object, array, string, number, boolean, null), which is handy when you’re inspecting an API response and want a quick sanity check.",
    ],
    examples: [
      {
        title: "Pretty-print",
        input: '{"name":"karthick","skills":["java","go"]}',
        description: "Reformats minified JSON with 2-space indentation.",
      },
      {
        title: "Minify",
        input: 'minify {"name": "karthick", "skills": ["java", "go"]}',
        description: "Collapses formatted JSON into a single line.",
      },
      {
        title: "Sort keys alphabetically",
        input: 'sort {"z": 1, "a": 2, "m": 3}',
        description: "Recursively sorts object keys — perfect for stable diffs.",
      },
      {
        title: "Catch a parse error",
        input: '{"name": "karthick",}',
        description: "Reports the trailing-comma error with line and column.",
      },
    ],
    faq: [
      {
        q: "Does it support trailing commas or comments?",
        a: "No. JSON.parse is strict per the JSON spec — trailing commas, comments, and unquoted keys all fail. If you need a relaxed parser, use JSON5 in your editor.",
      },
      {
        q: "Can it handle large files?",
        a: "Yes, within the limits of your browser’s memory. Tens of megabytes are usually fine on a modern laptop.",
      },
      {
        q: "Why sort keys?",
        a: "Sorted keys make diffing two API responses trivial because field order no longer matters. It’s also useful when generating canonical JSON for hashing or signing.",
      },
      {
        q: "Is my JSON sent anywhere?",
        a: "No. The entire formatter runs in your browser — your data never leaves your device.",
      },
      {
        q: "How does it report errors?",
        a: "When JSON.parse throws, the tool extracts the byte position from the error message, converts it to a line and column, and renders the offending source line with a caret marker.",
      },
    ],
    related: ["jwt-decoder", "base64", "http-status-codes"],
    keywords: ["json formatter", "json validator", "pretty json", "minify json", "json online"],
  },

  // ── HTTP status codes ──────────────────────────────────────────────────────
  {
    slug: "http-status-codes",
    toolName: "status",
    pageTitle: "HTTP Status Code Lookup (with Cloudflare, Nginx, AWS)",
    pageDescription:
      "Look up any HTTP status code — 1xx through 5xx, plus Cloudflare, Nginx, IIS, and AWS ELB extensions. Plain-English meaning, when it happens, and how to debug it.",
    h1: "HTTP Status Code Lookup",
    tagline: "70+ codes — IANA standard plus Cloudflare, Nginx, IIS, and AWS ELB extensions.",
    inputLabel: "Status code (e.g. 200, 404, 502)",
    inputPlaceholder: "504",
    inputRows: 1,
    defaultInput: "504",
    hero:
      "Look up any HTTP status code — including the special codes returned by Cloudflare, Nginx, IIS, and AWS load balancers. Each code includes its category, plain-English meaning, and a debugging hint.",
    about: [
      "HTTP status codes are how a server tells the client the outcome of a request. The first digit groups them into five classes: 1xx informational, 2xx success, 3xx redirection, 4xx client error, and 5xx server error. Within each class, individual codes carry specific semantics defined by RFC 9110 (the consolidated HTTP semantics RFC) plus a long tail of WebDAV, OAuth, and vendor-specific additions.",
      "This lookup covers every IANA-registered code, plus the most useful vendor extensions you’ll see in real-world ops: Cloudflare’s 520–530 series for upstream issues, Nginx’s 444 (no-response close) and 499 (client closed request), IIS’s 451 sub-codes, and AWS Elastic Load Balancer’s 460/463/464. For each code, you get the canonical name, the category, a one-line description, the spec it’s defined in, and — for the codes that frequently cause panic in on-call rotations — a hint about the most common root cause and where to look first.",
      "Beyond debugging, knowing the right status code matters when you’re building an API. Returning 404 when you mean 401 leaks information; returning 200 with an error body breaks every standard client; returning 500 when you mean 422 makes your error indistinguishable from a real outage. The lookup is a quick reference to make sure you’re using the right code in the right situation.",
    ],
    examples: [
      {
        title: "504 Gateway Timeout",
        input: "504",
        description: "Server-side error — upstream didn’t respond in time.",
      },
      {
        title: "401 vs 403",
        input: "401",
        description: "Look up both 401 and 403 to see the difference between unauthenticated and forbidden.",
      },
      {
        title: "Cloudflare 521",
        input: "521",
        description: "Cloudflare-specific code meaning the origin web server is down.",
      },
      {
        title: "Nginx 499",
        input: "499",
        description: "Client closed the connection before the server replied — common with aggressive timeouts.",
      },
    ],
    faq: [
      {
        q: "What does 504 actually mean?",
        a: "Gateway Timeout — a proxy or load balancer in front of the origin gave up waiting for an upstream response. Usually means the backend is slow, deadlocked, or down. Check upstream logs and connection pool saturation first.",
      },
      {
        q: "What is the difference between 401 and 403?",
        a: "401 Unauthorized means you didn’t prove who you are (missing or invalid credentials). 403 Forbidden means the server knows who you are and is refusing anyway (insufficient permissions).",
      },
      {
        q: "What is HTTP 418?",
        a: "I’m a teapot — defined in RFC 2324 as an April Fools’ joke and kept alive in jest. Not in the IANA registry but supported by many test suites.",
      },
      {
        q: "Why does my request return 520 from Cloudflare?",
        a: "520 means Cloudflare got an empty, unknown, or invalid response from the origin. Common causes: origin crashed mid-response, invalid headers, or a long-running query that closed the connection.",
      },
      {
        q: "Are 1xx codes ever returned to clients?",
        a: "Rarely. 100 Continue is used during large uploads when the client sends Expect: 100-continue. 103 Early Hints is increasingly used by CDNs to send Link preload headers before the final response. Most user-facing apps never see 1xx.",
      },
    ],
    related: ["json-formatter", "jwt-decoder", "user-agent-parser"],
    keywords: ["http status codes", "what does 504 mean", "401 vs 403", "cloudflare 520", "nginx 499"],
  },

  // ── Epoch converter ────────────────────────────────────────────────────────
  {
    slug: "epoch-converter",
    toolName: "epoch",
    pageTitle: "Epoch / Unix Timestamp Converter (s, ms, μs, ns)",
    pageDescription:
      "Convert any Unix timestamp to a human-readable date and back. Auto-detects seconds, milliseconds, microseconds, or nanoseconds. Shows UTC, ISO-8601, local time, and relative time.",
    h1: "Epoch & Unix Timestamp Converter",
    tagline: "Auto-detects seconds, milliseconds, microseconds and nanoseconds.",
    inputLabel: "Epoch timestamp or date",
    inputPlaceholder: "1700000000  —or—  2026-04-18T12:00:00Z  —or—  now",
    inputRows: 1,
    defaultInput: "1700000000",
    hero:
      "Paste any Unix timestamp — in seconds, milliseconds, microseconds, or nanoseconds — and see it as ISO-8601, UTC, your local time, and a relative “in 3 hours” phrase.",
    about: [
      "A Unix epoch timestamp is the number of time units that have elapsed since 1970-01-01 00:00:00 UTC. Different systems use different units: classical Unix uses seconds (10 digits today), JavaScript and most newer APIs use milliseconds (13 digits), Java’s Instant.toEpochMilli matches that, and high-resolution telemetry can be in microseconds (16 digits) or nanoseconds (19 digits). Mixing units is one of the most common bugs in date handling — a 1000× error is silent and easy to miss.",
      "This converter inspects the number of digits and auto-detects which unit you meant, then shows the resulting moment in three forms: ISO-8601 (the safest interchange format), UTC (for log correlation), and your browser’s local time (for human reading). It also computes a relative phrase such as “2 hours ago” or “in 14 minutes” so you can sanity-check whether a timestamp is fresh.",
      "The tool also handles the reverse direction: type a date in any format the JavaScript Date parser understands (ISO-8601, RFC 2822, common locale formats, or the literal “now”) and it returns the epoch in all four units, so you can paste it straight into your code or query without worrying about which unit your downstream system expects.",
    ],
    examples: [
      {
        title: "Seconds (10 digits)",
        input: "1700000000",
        description: "Classic Unix timestamp in seconds.",
      },
      {
        title: "Milliseconds (13 digits)",
        input: "1700000000000",
        description: "JavaScript / Java Instant style.",
      },
      {
        title: "ISO date to epoch",
        input: "2026-04-18T12:00:00Z",
        description: "Reverse direction — date string to epoch units.",
      },
      {
        title: "Right now",
        input: "now",
        description: "Returns the current epoch in all four units.",
      },
    ],
    faq: [
      {
        q: "How does it know whether my number is seconds or milliseconds?",
        a: "By digit count. 10 digits is treated as seconds, 13 as milliseconds, 16 as microseconds, 19 as nanoseconds. This works for any timestamp from roughly 2001 onwards.",
      },
      {
        q: "What about timezones?",
        a: "Epoch timestamps have no timezone — they are absolute. The converter shows UTC, ISO-8601, and your browser’s local time so you can read whichever you need.",
      },
      {
        q: "Will Unix time break in 2038?",
        a: "Only for systems that store the timestamp as a signed 32-bit integer (Y2K38). Most modern systems use 64-bit integers and are safe for hundreds of billions of years.",
      },
      {
        q: "Can I paste a relative date like “tomorrow”?",
        a: "No — only formats that Date.parse understands plus the literal “now”. For richer parsing, copy from a tool like dayjs and paste the resulting ISO string.",
      },
      {
        q: "Why am I getting a date in 1970?",
        a: "You probably pasted a value in seconds while your code expects milliseconds (or vice versa) — multiplying or dividing by 1000 fixes it. The auto-detection in this tool prevents this when you paste directly.",
      },
    ],
    related: ["jwt-decoder", "timezone-converter", "cron-expression"],
    keywords: ["epoch converter", "unix timestamp", "epoch to date", "milliseconds converter", "iso 8601"],
  },

  // ── Timezone converter ─────────────────────────────────────────────────────
  {
    slug: "timezone-converter",
    toolName: "tz",
    pageTitle: "Timezone Converter — Multi-Zone Time Tool",
    pageDescription:
      "Convert any time across timezones. Supports IANA names, common abbreviations (PST, IST, CET), and Nordic / Sweden timezones. Shows UTC offset and DST state.",
    h1: "Timezone Converter",
    tagline: "35+ aliases including Sweden, Nordics, full Europe, US, India and Asia-Pacific.",
    inputLabel: "Time + zones",
    inputPlaceholder: "9am PST in IST, Stockholm, UTC",
    inputRows: 2,
    defaultInput: "9am PST in IST, Stockholm, UTC, Tokyo",
    hero:
      "Type a time and the zones you care about — “9am PST in IST, Stockholm, UTC” — and see them all side by side. Supports IANA names, common abbreviations, and Nordic shortcuts.",
    about: [
      "Coordinating across timezones is a common annoyance for distributed teams. A meeting at 9am Pacific is also 9:30pm in Bengaluru, 6pm in Stockholm during summer (CEST) but 5pm in winter (CET). Daylight Saving Time, half-hour offsets (India, Newfoundland), and quarter-hour offsets (Nepal, Chatham Islands) all conspire to make mental arithmetic unreliable.",
      "This converter accepts natural-language phrases like “9am PST in IST, Stockholm, UTC” and returns each zone with its current UTC offset and DST status. It understands IANA timezone names (America/Los_Angeles, Europe/Stockholm), common abbreviations (PST, EST, CET, IST, JST), and city aliases (Stockholm, London, Tokyo, Sydney, Bengaluru). It also has explicit support for Sweden and the Nordic countries, which are easy to confuse because they share the same UTC offset but observe DST on different rules.",
      "Time conversions use the browser’s built-in Intl.DateTimeFormat API, which uses the Unicode CLDR timezone database and is updated with every browser release. That means DST transitions, recently abolished DST regimes (e.g. Russia, Türkiye), and historical changes are all handled correctly.",
    ],
    examples: [
      {
        title: "Cross-team standup",
        input: "9am PST in IST, Stockholm, UTC",
        description: "Useful for scheduling across US, India, and Europe.",
      },
      {
        title: "Tokyo product launch",
        input: "10am JST in PST, EST, UTC",
        description: "Convert an Asia/Tokyo time to North American zones.",
      },
      {
        title: "Sweden / Nordics shortcut",
        input: "now in Stockholm, Oslo, Copenhagen, Helsinki",
        description: "All four Nordic capitals at the current moment.",
      },
      {
        title: "Half-hour offsets",
        input: "noon UTC in IST, Tehran, Adelaide",
        description: "Demonstrates +5:30, +3:30, and +9:30/+10:30 offsets.",
      },
    ],
    faq: [
      {
        q: "Does it handle Daylight Saving Time?",
        a: "Yes. The browser’s Intl API uses the CLDR timezone database, which encodes DST rules and historical changes for every IANA zone.",
      },
      {
        q: "Why is IST returned for both Indian and Israeli time?",
        a: "IST is genuinely ambiguous — it’s used for both India Standard Time (UTC+5:30) and Israel Standard Time (UTC+2/+3). This tool defaults to India because that’s the more common usage; for Israel, use Asia/Jerusalem or “Israel”.",
      },
      {
        q: "Can I save a list of zones I care about?",
        a: "Not currently — every conversion is stateless. Bookmark the page with your default zones in the URL or copy the example you use most.",
      },
      {
        q: "What about Sweden specifically?",
        a: "Sweden uses Europe/Stockholm — CET in winter (UTC+1) and CEST in summer (UTC+2). The same applies to Norway, Denmark, and most of central Europe; Finland is one hour ahead.",
      },
      {
        q: "Is the time accurate?",
        a: "Yes — it uses your device’s clock plus the CLDR rules. If your system clock is wrong (no NTP), the relative offset is still right but the absolute moment will be off by however much your clock drifts.",
      },
    ],
    related: ["epoch-converter", "cron-expression", "jwt-decoder"],
    keywords: ["timezone converter", "pst to ist", "stockholm time", "timezone tool", "world clock"],
  },

  // ── User-agent parser ──────────────────────────────────────────────────────
  {
    slug: "user-agent-parser",
    toolName: "useragent",
    pageTitle: "User-Agent Parser — Detect Browser, OS, Device",
    pageDescription:
      "Parse any User-Agent string into browser, engine, OS, device, and CPU. Detects mobile vs desktop, vendor, and architecture. Includes your own browser as the default.",
    h1: "User-Agent Parser",
    tagline: "Browser, engine, OS, device and CPU — your own UA loaded by default.",
    inputLabel: "User-Agent string (or leave empty for your own)",
    inputPlaceholder:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15",
    inputRows: 3,
    defaultInput: "",
    hero:
      "Paste a User-Agent header to break it into browser, engine, operating system, device, and CPU architecture — or leave it empty to inspect your own browser plus its environment.",
    about: [
      "The User-Agent header is the primary way browsers identify themselves to a server. It’s also the most-lied-about header on the web — every browser pretends to be every other browser to defeat 1990s-era “if (browser == Netscape)” logic. Parsing it reliably requires a maintained database of vendor strings and version patterns, which this tool provides via the popular ua-parser-js library.",
      "Given a UA string, the parser returns five components: the browser (Chrome, Safari, Edge, Firefox, etc. with version), the rendering engine (Blink, WebKit, Gecko), the operating system (with version), the device type and model (mobile, tablet, console, smart-tv, embedded — empty for desktop), and the CPU architecture (x86_64, arm64, etc.). When you don’t supply a UA, the tool reads navigator.userAgent and additionally reports your screen resolution, viewport, timezone, language, network status, CPU core count, and device memory — a quick fingerprint of your runtime environment.",
      "Note that modern browsers are deprecating the UA string in favour of UA-Client-Hints (Sec-CH-UA-* headers). Chrome already sends a heavily reduced UA and only reveals full details on request. For server-side detection in 2026, prefer Client Hints when you can; UA parsing remains useful for debugging analytics and for inspecting raw access logs.",
    ],
    examples: [
      {
        title: "iPhone Safari",
        input:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
        description: "Identifies Safari, WebKit, iOS 17, mobile, and Apple as vendor.",
      },
      {
        title: "Android Chrome",
        input:
          "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
        description: "Chrome on a Pixel running Android 14.",
      },
      {
        title: "Macbook Chrome",
        input:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        description: "Desktop Chrome on macOS.",
      },
      {
        title: "Your own browser",
        input: "",
        description: "Leave the field empty to inspect your current browser plus environment data.",
      },
    ],
    faq: [
      {
        q: "Why does Chrome on Android say “Mozilla/5.0”?",
        a: "All major browsers start their UA with “Mozilla/5.0” for historical compatibility — early sites only sent modern features to “Mozilla”, so everyone copied the prefix and never stopped.",
      },
      {
        q: "How accurate is UA detection in 2026?",
        a: "It’s a best-effort heuristic. Browsers are actively reducing the UA string to combat fingerprinting, so device-level detection (model, OS minor version) is increasingly unreliable. For server-side decisions, prefer Sec-CH-UA-* Client Hints.",
      },
      {
        q: "Is my UA sent to a server?",
        a: "No. Parsing happens entirely in your browser. Your UA never leaves the page.",
      },
      {
        q: "Can I detect bots and crawlers?",
        a: "Common bots (Googlebot, Bingbot, GPTBot, Applebot) declare themselves and will be parsed correctly. Sophisticated bots impersonate real browsers and require richer heuristics (TLS fingerprint, behavioural signals) to identify.",
      },
      {
        q: "What is the difference between browser, engine, and OS?",
        a: "The browser is the application (Chrome, Safari). The engine is the rendering and JS core (Blink, WebKit, Gecko). The OS is the host operating system. Edge and Chrome share the same engine (Blink) but are different browsers.",
      },
    ],
    related: ["http-status-codes", "jwt-decoder", "base64"],
    keywords: ["user agent parser", "browser detection", "ua string", "detect browser", "device detection"],
  },

  // ── Cron expression ────────────────────────────────────────────────────────
  {
    slug: "cron-expression",
    toolName: "cron",
    pageTitle: "Cron Expression Explainer & Builder",
    pageDescription:
      "Translate any cron expression into plain English, see the next 5 run times, or describe a schedule and get the cron back. Supports standard 5-field and 6-field with seconds.",
    h1: "Cron Expression Explainer & Builder",
    tagline: "Bidirectional — explain a cron, or describe a schedule and get the cron back.",
    inputLabel: "Cron expression or English description",
    inputPlaceholder: "*/15 * * * *  —or—  every weekday at 9am",
    inputRows: 2,
    defaultInput: "*/15 * * * *",
    hero:
      "Paste a cron expression to see what it means and the next five run times — or describe a schedule in plain English and get the cron expression back.",
    about: [
      "Cron is the venerable Unix scheduler that has powered nightly backups, cleanup jobs, and metric rollups since 1975. Its syntax — five space-separated fields for minute, hour, day-of-month, month, and day-of-week — is dense but expressive. Step values (*/15), ranges (1-5), lists (1,3,5), and named tokens (MON-FRI, JAN-DEC) compose into surprisingly powerful schedules in only a few characters.",
      "This tool runs in two directions. Forward: paste any cron expression and see a plain-English description (“At every 15th minute”) plus the next five execution times in your local timezone. Backward: type an English description like “every weekday at 9am” or “first day of every month at midnight” and get the matching cron back. Forward parsing uses cronstrue (the same library that powers Hangfire’s UI) and cron-parser for the next-run calculation; backward translation is a curated set of common patterns.",
      "Standard cron has five fields. Quartz and many cloud schedulers (AWS EventBridge, Spring @Scheduled) use six fields with seconds prepended, and some use seven with year appended. This tool detects the field count automatically. Note that day-of-month and day-of-week are OR-combined, not AND — “1 1 1 * MON” fires at 01:01 on the 1st of any month AND on every Monday, not just on Mondays that fall on the 1st.",
    ],
    examples: [
      {
        title: "Every 15 minutes",
        input: "*/15 * * * *",
        description: "Step value — the most common cron pattern.",
      },
      {
        title: "Every weekday at 9am",
        input: "0 9 * * 1-5",
        description: "Range syntax for Monday through Friday.",
      },
      {
        title: "First of every month at midnight",
        input: "0 0 1 * *",
        description: "Monthly batch job pattern.",
      },
      {
        title: "Reverse — describe a schedule",
        input: "every weekday at 9am",
        description: "Returns 0 9 * * 1-5 plus the next runs.",
      },
    ],
    faq: [
      {
        q: "What is the difference between 5-field and 6-field cron?",
        a: "Standard Unix cron uses 5 fields (min hr dom mon dow). Quartz, AWS EventBridge, and Spring @Scheduled add a seconds field at the front, giving 6 fields. The tool auto-detects the format.",
      },
      {
        q: "What does */15 mean?",
        a: "Step value — “every 15 units of this field starting at 0”. So */15 in the minute field means 0, 15, 30, and 45 past the hour.",
      },
      {
        q: "Does day-of-month AND day-of-week need to match?",
        a: "No, they are OR-combined. “0 0 1 * MON” fires on the 1st of every month and every Monday. To require both, use a tool like systemd timers or compute it in your job.",
      },
      {
        q: "What timezone are the next-run times in?",
        a: "The browser’s local timezone. Cron itself runs in whatever timezone the host (or scheduler config) specifies — be careful when porting across regions, especially around DST.",
      },
      {
        q: "Why does my cron run at unexpected times?",
        a: "Common causes: server timezone differs from yours, you confused day-of-month with day-of-week, or you used an OR-combined day rule by accident. Use the next-run preview to sanity-check before deploying.",
      },
    ],
    related: ["epoch-converter", "timezone-converter", "json-formatter"],
    keywords: ["cron expression", "cron parser", "cron explainer", "cron builder", "schedule expression"],
  },
];

export const TOOLS_CONTENT_BY_SLUG: Record<string, ToolContent> = TOOLS_CONTENT.reduce<
  Record<string, ToolContent>
>((acc, t) => {
  acc[t.slug] = t;
  return acc;
}, {});

export const TOOLS_CONTENT_BY_NAME: Record<string, ToolContent> = TOOLS_CONTENT.reduce<
  Record<string, ToolContent>
>((acc, t) => {
  acc[t.toolName] = t;
  return acc;
}, {});

export const SITE_URL = "https://karthickraman.github.io";

/**
 * Build the per-tool Next.js Metadata object. Centralised so every tool page
 * stays minimal and metadata stays consistent.
 */
export function buildToolMetadata(slug: string): Metadata {
  const tool = TOOLS_CONTENT_BY_SLUG[slug];
  if (!tool) {
    return {
      title: "Tool not found",
      description: "Requested tool does not exist.",
    };
  }
  const canonical = `/tools/${tool.slug}/`;
  return {
    title: tool.pageTitle,
    description: tool.pageDescription,
    keywords: tool.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: tool.pageTitle,
      description: tool.pageDescription,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: tool.pageTitle,
      description: tool.pageDescription,
    },
  };
}

