import { type Tool, type OutputLine, ok, err } from "../types";

type Rarity = "common" | "rare" | "deprecated" | "unused" | "vendor";

interface StatusInfo {
  name: string;
  category: "info" | "success" | "redirect" | "client" | "server";
  description: string;
  hint?: string;
  rarity?: Rarity;
  vendor?: string;
  spec?: string;
}

const STATUS_CODES: Record<number, StatusInfo> = {
  // ── 1xx Informational ─────────────────────────────────────────
  100: { name: "Continue", category: "info", description: "Initial request received; client should continue with body.", spec: "RFC 9110" },
  101: { name: "Switching Protocols", category: "info", description: "Server agrees to switch protocols (e.g. WebSocket upgrade).", spec: "RFC 9110" },
  102: { name: "Processing", category: "info", description: "Request received, still processing.", rarity: "rare", spec: "RFC 2518 (WebDAV)" },
  103: { name: "Early Hints", category: "info", description: "Server is sending preliminary headers (e.g. Link preload) before final response.", rarity: "rare", spec: "RFC 8297" },

  // ── 2xx Success ───────────────────────────────────────────────
  200: { name: "OK", category: "success", description: "Request succeeded.", spec: "RFC 9110" },
  201: { name: "Created", category: "success", description: "Resource created. Look for Location header.", spec: "RFC 9110" },
  202: { name: "Accepted", category: "success", description: "Accepted for processing, not yet completed.", spec: "RFC 9110" },
  203: { name: "Non-Authoritative Information", category: "success", description: "Returned meta-info differs from origin server (e.g. via proxy transformation).", rarity: "rare", spec: "RFC 9110" },
  204: { name: "No Content", category: "success", description: "Success, no body returned.", spec: "RFC 9110" },
  205: { name: "Reset Content", category: "success", description: "Tells the client to reset the document view (e.g. clear a form).", rarity: "rare", spec: "RFC 9110" },
  206: { name: "Partial Content", category: "success", description: "Range request fulfilled.", spec: "RFC 9110" },
  207: { name: "Multi-Status", category: "success", description: "Body contains multiple status codes for sub-requests.", rarity: "rare", spec: "RFC 4918 (WebDAV)" },
  208: { name: "Already Reported", category: "success", description: "Members of a DAV binding already enumerated.", rarity: "rare", spec: "RFC 5842 (WebDAV)" },
  226: { name: "IM Used", category: "success", description: "Server fulfilled GET via HTTP Delta encoding instance manipulation.", rarity: "rare", spec: "RFC 3229" },

  // ── 3xx Redirect ──────────────────────────────────────────────
  300: { name: "Multiple Choices", category: "redirect", description: "Multiple representations available; client/agent should pick.", rarity: "rare", spec: "RFC 9110" },
  301: { name: "Moved Permanently", category: "redirect", description: "Resource permanently moved. Update bookmarks.", spec: "RFC 9110" },
  302: { name: "Found", category: "redirect", description: "Temporary redirect (legacy semantics).", spec: "RFC 9110" },
  303: { name: "See Other", category: "redirect", description: "Redirect; client should GET the new resource.", spec: "RFC 9110" },
  304: { name: "Not Modified", category: "redirect", description: "Cached version is still valid.", spec: "RFC 9110" },
  305: { name: "Use Proxy", category: "redirect", description: "Resource must be accessed through specified proxy.", rarity: "deprecated", spec: "RFC 9110 (deprecated for security)" },
  306: { name: "(Unused / Switch Proxy)", category: "redirect", description: "Reserved; no longer used in HTTP spec.", rarity: "unused", spec: "Reserved" },
  307: { name: "Temporary Redirect", category: "redirect", description: "Like 302 but preserves the HTTP method.", spec: "RFC 9110" },
  308: { name: "Permanent Redirect", category: "redirect", description: "Like 301 but preserves the HTTP method.", spec: "RFC 9110" },

  // ── 4xx Client Errors ─────────────────────────────────────────
  400: { name: "Bad Request", category: "client", description: "Malformed request syntax or invalid parameters.", hint: "Validate JSON body, query params, and required fields.", spec: "RFC 9110" },
  401: { name: "Unauthorized", category: "client", description: "Authentication required or failed.", hint: "Check Authorization header and token validity.", spec: "RFC 9110" },
  402: { name: "Payment Required", category: "client", description: "Reserved; sometimes used for paid APIs (Stripe, GitHub).", rarity: "rare", spec: "RFC 9110 (reserved)" },
  403: { name: "Forbidden", category: "client", description: "Authenticated but not allowed.", hint: "Verify roles, scopes, or resource ownership.", spec: "RFC 9110" },
  404: { name: "Not Found", category: "client", description: "Resource does not exist.", hint: "Check the URL path and route registration.", spec: "RFC 9110" },
  405: { name: "Method Not Allowed", category: "client", description: "HTTP method not supported on this resource.", hint: "Inspect the Allow response header.", spec: "RFC 9110" },
  406: { name: "Not Acceptable", category: "client", description: "Server can't return content matching Accept header.", spec: "RFC 9110" },
  407: { name: "Proxy Authentication Required", category: "client", description: "Client must authenticate with the proxy first.", rarity: "rare", spec: "RFC 9110" },
  408: { name: "Request Timeout", category: "client", description: "Client took too long to send the request.", spec: "RFC 9110" },
  409: { name: "Conflict", category: "client", description: "Request conflicts with current state.", hint: "Common for optimistic locking or duplicate creates.", spec: "RFC 9110" },
  410: { name: "Gone", category: "client", description: "Resource permanently removed.", spec: "RFC 9110" },
  411: { name: "Length Required", category: "client", description: "Content-Length header missing.", spec: "RFC 9110" },
  412: { name: "Precondition Failed", category: "client", description: "An If-* header precondition (If-Match, If-Unmodified-Since) failed.", rarity: "rare", spec: "RFC 9110" },
  413: { name: "Payload Too Large", category: "client", description: "Request body exceeds server limit.", spec: "RFC 9110" },
  414: { name: "URI Too Long", category: "client", description: "URL exceeds server limit.", spec: "RFC 9110" },
  415: { name: "Unsupported Media Type", category: "client", description: "Content-Type not supported.", hint: "Set Content-Type: application/json (or expected type).", spec: "RFC 9110" },
  416: { name: "Range Not Satisfiable", category: "client", description: "Requested Range header is invalid for the resource.", rarity: "rare", spec: "RFC 9110" },
  417: { name: "Expectation Failed", category: "client", description: "Server cannot meet requirement of the Expect header.", rarity: "rare", spec: "RFC 9110" },
  418: { name: "I'm a teapot", category: "client", description: "RFC 2324 Hyper Text Coffee Pot Control Protocol joke.", spec: "RFC 2324 (April Fools)" },
  421: { name: "Misdirected Request", category: "client", description: "Request directed at a server unable to produce a response (HTTP/2 connection coalescing).", rarity: "rare", spec: "RFC 9110" },
  422: { name: "Unprocessable Entity", category: "client", description: "Body parsed but semantically invalid.", hint: "Common for validation errors in REST APIs.", spec: "RFC 9110" },
  423: { name: "Locked", category: "client", description: "Resource is locked.", rarity: "rare", spec: "RFC 4918 (WebDAV)" },
  424: { name: "Failed Dependency", category: "client", description: "Request failed because a previous request it depended on failed.", rarity: "rare", spec: "RFC 4918 (WebDAV)" },
  425: { name: "Too Early", category: "client", description: "Server unwilling to risk replaying a request that might be replayed.", rarity: "rare", spec: "RFC 8470" },
  426: { name: "Upgrade Required", category: "client", description: "Client must switch to a different protocol (e.g. TLS).", rarity: "rare", spec: "RFC 9110" },
  428: { name: "Precondition Required", category: "client", description: "Server requires conditional request to avoid lost-update problem.", spec: "RFC 6585" },
  429: { name: "Too Many Requests", category: "client", description: "Rate limited.", hint: "Check Retry-After header and back off.", spec: "RFC 6585" },
  431: { name: "Request Header Fields Too Large", category: "client", description: "Headers exceed server limit.", spec: "RFC 6585" },
  451: { name: "Unavailable For Legal Reasons", category: "client", description: "Blocked by legal demand (DMCA, court order, censorship).", spec: "RFC 7725" },

  // ── 5xx Server Errors ─────────────────────────────────────────
  500: { name: "Internal Server Error", category: "server", description: "Generic server failure.", hint: "Check server logs and stack traces.", spec: "RFC 9110" },
  501: { name: "Not Implemented", category: "server", description: "Server doesn't support this functionality.", spec: "RFC 9110" },
  502: { name: "Bad Gateway", category: "server", description: "Upstream server returned invalid response.", hint: "Verify upstream service health, DNS, and proxy config.", spec: "RFC 9110" },
  503: { name: "Service Unavailable", category: "server", description: "Server overloaded or down for maintenance.", hint: "Check Retry-After; investigate capacity / outage.", spec: "RFC 9110" },
  504: { name: "Gateway Timeout", category: "server", description: "Upstream did not respond in time.", hint: "Increase timeout or fix slow upstream.", spec: "RFC 9110" },
  505: { name: "HTTP Version Not Supported", category: "server", description: "Server doesn't support the HTTP version.", rarity: "rare", spec: "RFC 9110" },
  506: { name: "Variant Also Negotiates", category: "server", description: "Internal config error: chosen variant is itself a negotiating endpoint.", rarity: "rare", spec: "RFC 2295" },
  507: { name: "Insufficient Storage", category: "server", description: "Server has no storage to complete request.", rarity: "rare", spec: "RFC 4918 (WebDAV)" },
  508: { name: "Loop Detected", category: "server", description: "Infinite loop detected while processing.", rarity: "rare", spec: "RFC 5842 (WebDAV)" },
  510: { name: "Not Extended", category: "server", description: "Further extensions to the request are required.", rarity: "rare", spec: "RFC 2774 (obsolete)" },
  511: { name: "Network Authentication Required", category: "server", description: "Captive portal authentication needed.", spec: "RFC 6585" },

  // ── Vendor: Nginx ─────────────────────────────────────────────
  444: { name: "No Response", category: "client", description: "Nginx closed the connection without sending a response (often used to block bad clients).", rarity: "vendor", vendor: "Nginx" },
  494: { name: "Request Header Too Large", category: "client", description: "Nginx-specific: request header is larger than client_header_buffer_size.", rarity: "vendor", vendor: "Nginx" },
  495: { name: "SSL Certificate Error", category: "client", description: "Nginx could not verify the client's SSL certificate.", rarity: "vendor", vendor: "Nginx" },
  496: { name: "SSL Certificate Required", category: "client", description: "Nginx required a client SSL certificate but none was provided.", rarity: "vendor", vendor: "Nginx" },
  497: { name: "HTTP Request Sent to HTTPS Port", category: "client", description: "Plain HTTP request was sent to a port configured for HTTPS.", rarity: "vendor", vendor: "Nginx" },
  499: { name: "Client Closed Request", category: "client", description: "Client closed the connection before the server could respond.", hint: "Often indicates client timeout, user navigated away, or upstream is slow.", rarity: "vendor", vendor: "Nginx" },

  // ── Vendor: IIS ───────────────────────────────────────────────
  440: { name: "Login Time-out", category: "client", description: "IIS-specific: client session expired and must log in again.", rarity: "vendor", vendor: "Microsoft IIS" },
  449: { name: "Retry With", category: "client", description: "IIS-specific: server cannot honor the request, retry with appropriate action.", rarity: "vendor", vendor: "Microsoft IIS" },

  // ── Vendor: AWS Elastic Load Balancer ─────────────────────────
  460: { name: "Client Closed Connection (ELB)", category: "client", description: "AWS ELB: client closed the connection before the idle timeout elapsed.", rarity: "vendor", vendor: "AWS ELB" },
  463: { name: "Too Many X-Forwarded-For IPs", category: "client", description: "AWS ELB: X-Forwarded-For header contains more than 30 IP addresses.", rarity: "vendor", vendor: "AWS ELB" },
  561: { name: "Unauthorized (ELB)", category: "server", description: "AWS ELB: the IdP returned an unauthorized error during authentication.", rarity: "vendor", vendor: "AWS ELB" },

  // ── Vendor: Cloudflare ────────────────────────────────────────
  520: { name: "Web Server Returned an Unknown Error", category: "server", description: "Cloudflare: origin returned an empty, unknown, or unexpected response.", hint: "Check origin server logs; common with crashes or misconfigured handlers.", rarity: "vendor", vendor: "Cloudflare" },
  521: { name: "Web Server Is Down", category: "server", description: "Cloudflare: origin refused the connection.", hint: "Verify origin is running and not blocking Cloudflare IPs.", rarity: "vendor", vendor: "Cloudflare" },
  522: { name: "Connection Timed Out", category: "server", description: "Cloudflare: TCP handshake to origin timed out.", hint: "Check firewall, security groups, and origin reachability.", rarity: "vendor", vendor: "Cloudflare" },
  523: { name: "Origin Is Unreachable", category: "server", description: "Cloudflare: cannot reach origin server (DNS or routing failure).", rarity: "vendor", vendor: "Cloudflare" },
  524: { name: "A Timeout Occurred", category: "server", description: "Cloudflare: TCP connection to origin succeeded but origin didn't respond in time (default 100s).", hint: "Optimize origin response time or use Cloudflare Workers for long tasks.", rarity: "vendor", vendor: "Cloudflare" },
  525: { name: "SSL Handshake Failed", category: "server", description: "Cloudflare: SSL/TLS handshake to origin failed.", hint: "Check origin certificate validity and supported cipher suites.", rarity: "vendor", vendor: "Cloudflare" },
  526: { name: "Invalid SSL Certificate", category: "server", description: "Cloudflare: origin returned an invalid SSL certificate.", rarity: "vendor", vendor: "Cloudflare" },
  527: { name: "Railgun Error", category: "server", description: "Cloudflare: connection between Cloudflare and origin's Railgun server interrupted.", rarity: "vendor", vendor: "Cloudflare (deprecated)" },
  530: { name: "Origin DNS Error", category: "server", description: "Cloudflare: domain returns this code in conjunction with a 1xxx error from Cloudflare's error pages.", rarity: "vendor", vendor: "Cloudflare" },
};

const CATEGORY_KIND: Record<StatusInfo["category"], OutputLine["kind"]> = {
  info: "info",
  success: "success",
  redirect: "info",
  client: "warn",
  server: "error",
};

const RARITY_LABEL: Record<Rarity, string> = {
  common: "",
  rare: "rare · seldom encountered in practice",
  deprecated: "deprecated · avoid using",
  unused: "unused · reserved by the spec, no real meaning",
  vendor: "vendor-specific · not in the IANA registry",
};

export const statusTool: Tool = {
  name: "status",
  category: "lookup",
  description: "Explain an HTTP status code (IANA + vendor extensions).",
  usage: "status <code>",
  examples: ["status 200", "status 404", "status 502", "status 418", "status 499", "status 524"],
  run(args) {
    const trimmed = args.trim();
    if (!trimmed) {
      return err(
        "Missing status code.",
        "Try: status 404  ·  status 524 (Cloudflare)  ·  status 499 (Nginx)",
      );
    }
    const code = Number(trimmed.split(/\s+/)[0]);
    if (!Number.isInteger(code) || code < 100 || code > 599) {
      return err("Status codes must be integers between 100 and 599.");
    }

    const info = STATUS_CODES[code];
    if (!info) {
      const range =
        code < 200
          ? "informational"
          : code < 300
            ? "success"
            : code < 400
              ? "redirect"
              : code < 500
                ? "client error"
                : "server error";
      return ok([
        { text: `${code} — Unassigned`, kind: "warn" },
        {
          text: `Falls in the ${range} range (${Math.floor(code / 100)}xx).`,
          kind: "muted",
        },
        {
          text: "Not in the IANA registry or known vendor extensions. Likely custom to a specific app or framework.",
          kind: "muted",
        },
      ]);
    }

    const lines: OutputLine[] = [
      { text: `${code} ${info.name}`, kind: CATEGORY_KIND[info.category] },
      { text: info.description, kind: "default" },
    ];

    if (info.rarity && info.rarity !== "common") {
      lines.push({ text: RARITY_LABEL[info.rarity], kind: "warn" });
    }
    if (info.vendor) {
      lines.push({ text: `vendor: ${info.vendor}`, kind: "muted" });
    }
    if (info.spec) {
      lines.push({ text: `spec: ${info.spec}`, kind: "muted" });
    }
    if (info.hint) {
      lines.push({ text: `hint: ${info.hint}`, kind: "muted" });
    }

    return ok(lines);
  },
};
