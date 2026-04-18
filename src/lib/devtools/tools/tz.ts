import { type Tool, type OutputLine, ok, err } from "../types";

// ─── Supported timezone shortcuts (abbrev → IANA name) ───────────────────────
const ZONE_ALIASES: Record<string, string> = {
  utc: "UTC",
  gmt: "Etc/GMT",
  z: "UTC",

  ist: "Asia/Kolkata", // Indian Standard Time (default — disambiguated below)
  ind: "Asia/Kolkata",
  india: "Asia/Kolkata",

  pt: "America/Los_Angeles",
  pst: "America/Los_Angeles",
  pdt: "America/Los_Angeles",
  la: "America/Los_Angeles",
  pacific: "America/Los_Angeles",

  et: "America/New_York",
  est: "America/New_York",
  edt: "America/New_York",
  ny: "America/New_York",
  nyc: "America/New_York",
  eastern: "America/New_York",

  ct: "America/Chicago",
  cst: "America/Chicago",
  cdt: "America/Chicago",
  chicago: "America/Chicago",
  central: "America/Chicago",

  mt: "America/Denver",
  mst: "America/Denver",
  mdt: "America/Denver",
  denver: "America/Denver",
  mountain: "America/Denver",

  bst: "Europe/London",
  uk: "Europe/London",
  london: "Europe/London",

  cet: "Europe/Berlin",
  cest: "Europe/Berlin",
  berlin: "Europe/Berlin",
  paris: "Europe/Paris",
  amsterdam: "Europe/Amsterdam",

  // Nordic / Sweden
  swe: "Europe/Stockholm",
  sweden: "Europe/Stockholm",
  stockholm: "Europe/Stockholm",
  sthlm: "Europe/Stockholm",
  oslo: "Europe/Oslo",
  norway: "Europe/Oslo",
  copenhagen: "Europe/Copenhagen",
  denmark: "Europe/Copenhagen",
  helsinki: "Europe/Helsinki",
  finland: "Europe/Helsinki",
  eet: "Europe/Helsinki",
  eest: "Europe/Helsinki",
  reykjavik: "Atlantic/Reykjavik",
  iceland: "Atlantic/Reykjavik",

  // Other Europe
  madrid: "Europe/Madrid",
  spain: "Europe/Madrid",
  rome: "Europe/Rome",
  italy: "Europe/Rome",
  zurich: "Europe/Zurich",
  vienna: "Europe/Vienna",
  warsaw: "Europe/Warsaw",
  poland: "Europe/Warsaw",
  athens: "Europe/Athens",
  lisbon: "Europe/Lisbon",
  dublin: "Europe/Dublin",
  istanbul: "Europe/Istanbul",
  trt: "Europe/Istanbul",
  moscow: "Europe/Moscow",
  msk: "Europe/Moscow",
  russia: "Europe/Moscow",

  jst: "Asia/Tokyo",
  japan: "Asia/Tokyo",
  tokyo: "Asia/Tokyo",

  aet: "Australia/Sydney",
  aest: "Australia/Sydney",
  aedt: "Australia/Sydney",
  sydney: "Australia/Sydney",

  sgt: "Asia/Singapore",
  sg: "Asia/Singapore",
  singapore: "Asia/Singapore",

  hkt: "Asia/Hong_Kong",
  hk: "Asia/Hong_Kong",
  hongkong: "Asia/Hong_Kong",

  kst: "Asia/Seoul",
  seoul: "Asia/Seoul",
  korea: "Asia/Seoul",

  dxb: "Asia/Dubai",
  gst: "Asia/Dubai",
  dubai: "Asia/Dubai",

  brt: "America/Sao_Paulo",
  saopaulo: "America/Sao_Paulo",
  brazil: "America/Sao_Paulo",

  nzst: "Pacific/Auckland",
  nzdt: "Pacific/Auckland",
  auckland: "Pacific/Auckland",
};

const DEFAULT_ZONES: { label: string; tz: string }[] = [
  { label: "UTC", tz: "UTC" },
  { label: "IST (Kolkata)", tz: "Asia/Kolkata" },
  { label: "PT (Los Angeles)", tz: "America/Los_Angeles" },
  { label: "ET (New York)", tz: "America/New_York" },
  { label: "CT (Chicago)", tz: "America/Chicago" },
  { label: "GMT/BST (London)", tz: "Europe/London" },
  { label: "CET (Stockholm)", tz: "Europe/Stockholm" },
  { label: "CET (Berlin)", tz: "Europe/Berlin" },
  { label: "EET (Helsinki)", tz: "Europe/Helsinki" },
  { label: "GST (Dubai)", tz: "Asia/Dubai" },
  { label: "SGT (Singapore)", tz: "Asia/Singapore" },
  { label: "JST (Tokyo)", tz: "Asia/Tokyo" },
  { label: "AET (Sydney)", tz: "Australia/Sydney" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function normalizeZone(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase().replace(/[\s_]+/g, "");
  if (ZONE_ALIASES[lower]) return ZONE_ALIASES[lower];

  // Try as IANA (e.g. "Asia/Tokyo", "America/New_York")
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: trimmed });
    return trimmed;
  } catch {
    return null;
  }
}

function localTz(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

interface ZoneParts {
  year: number; month: number; day: number;
  hour: number; minute: number; second: number;
  offsetMinutes: number; // signed
  abbr: string;
}

function partsInZone(date: Date, tz: string): ZoneParts {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    timeZoneName: "shortOffset",
  });
  const parts = dtf.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0;
  const minute = Number(get("minute"));
  const second = Number(get("second"));
  const tzName = get("timeZoneName"); // e.g. "GMT-7", "GMT+5:30"
  const m = tzName.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  let offsetMinutes = 0;
  if (m) {
    const sign = m[1] === "+" ? 1 : -1;
    offsetMinutes = sign * (Number(m[2]) * 60 + Number(m[3] ?? "0"));
  }
  return { year, month, day, hour, minute, second, offsetMinutes, abbr: tzName };
}

// Compute the UTC instant for given wall-clock components in a target tz.
function utcFromZoneComponents(
  year: number, month: number, day: number,
  hour: number, minute: number, second: number, tz: string,
): number {
  // Initial guess: treat components as UTC.
  let utc = Date.UTC(year, month - 1, day, hour, minute, second);
  // Refine twice: ask Intl what tz we'd see at this UTC, adjust by the diff.
  for (let i = 0; i < 2; i++) {
    const got = partsInZone(new Date(utc), tz);
    const target = Date.UTC(year, month - 1, day, hour, minute, second);
    const observed = Date.UTC(got.year, got.month - 1, got.day, got.hour, got.minute, got.second);
    const diff = target - observed;
    if (diff === 0) break;
    utc += diff;
  }
  return utc;
}

interface ParsedInput {
  date: Date;
  sourceZone: string;
  description: string;
}

function parseInput(raw: string): ParsedInput | { error: string } {
  const s = raw.trim();
  if (!s || s.toLowerCase() === "now") {
    return { date: new Date(), sourceZone: localTz(), description: "current time" };
  }

  // Pure epoch number
  if (/^-?\d+(\.\d+)?$/.test(s)) {
    const n = Number(s);
    const ms = Math.abs(n) >= 1e11 ? n : n * 1000;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return { error: "Invalid epoch value." };
    return { date: d, sourceZone: "UTC", description: `epoch ${s}` };
  }

  // Try native parse first (handles ISO 8601 with offset, RFC 2822, etc.)
  const native = new Date(s);
  if (!Number.isNaN(native.getTime()) && /\d{4}/.test(s)) {
    return { date: native, sourceZone: localTz(), description: s };
  }

  // Split off trailing zone token: e.g. "2026-04-20 15:30 Asia/Kolkata", "9am IST", "3:30pm PT"
  const parts = s.split(/\s+/);
  let zone: string | null = null;
  let timePart = s;
  if (parts.length > 1) {
    const last = parts[parts.length - 1];
    const z = normalizeZone(last);
    if (z) {
      zone = z;
      timePart = parts.slice(0, -1).join(" ");
    }
  }
  const targetZone = zone ?? localTz();

  // Pattern A: HH(:MM)?(am|pm)?  → today in targetZone at given time
  const timeOnly = timePart.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (timeOnly) {
    let h = Number(timeOnly[1]);
    const m = timeOnly[2] ? Number(timeOnly[2]) : 0;
    const ampm = timeOnly[3]?.toLowerCase();
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    if (h > 23 || m > 59) return { error: "Invalid hour or minute." };

    // "today" in the target zone (not local)
    const nowInZone = partsInZone(new Date(), targetZone);
    const ms = utcFromZoneComponents(nowInZone.year, nowInZone.month, nowInZone.day, h, m, 0, targetZone);
    return {
      date: new Date(ms),
      sourceZone: targetZone,
      description: `today ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${zone ?? "local"}`,
    };
  }

  // Pattern B: YYYY-MM-DD HH:MM(:SS)?  with optional zone trailing
  const fullDate = timePart.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (fullDate) {
    const [, y, mo, d, hh, mm, ss] = fullDate;
    const h = hh ? Number(hh) : 0;
    const min = mm ? Number(mm) : 0;
    const sec = ss ? Number(ss) : 0;
    const ms = utcFromZoneComponents(Number(y), Number(mo), Number(d), h, min, sec, targetZone);
    return {
      date: new Date(ms),
      sourceZone: targetZone,
      description: `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")} ${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")} ${zone ?? "local"}`,
    };
  }

  // Last-ditch native parse
  if (!Number.isNaN(native.getTime())) {
    return { date: native, sourceZone: localTz(), description: s };
  }

  return {
    error: `Couldn't parse "${s}". Try: now · 9am IST · 3:30pm PT · 2026-04-20 15:30 Asia/Tokyo · 1700000000`,
  };
}

function fmtZone(date: Date, tz: string): string {
  const p = partsInZone(date, tz);
  const time = `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
  const dateStr = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
  }).format(date);
  return `${time}  ${dateStr}  (${p.abbr})`;
}

function fmtOffsetDelta(targetMinutes: number, baseMinutes: number): string {
  const diff = targetMinutes - baseMinutes;
  const sign = diff === 0 ? "±" : diff > 0 ? "+" : "−";
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (diff === 0) return "  same as source";
  return `${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : "h"}${m ? "" : ""} from source`;
}

// ─── Tool definition ────────────────────────────────────────────────────────
export const tzTool: Tool = {
  name: "tz",
  category: "lookup",
  description: "Convert a time across multiple timezones (auto-detects DST + offsets).",
  usage: "tz <time> [zone]   |   tz <time> in <zone1>,<zone2>,...",
  examples: [
    "tz now",
    "tz 9am IST",
    "tz 3:30pm PT",
    "tz 9am Stockholm",
    "tz 2026-04-20 15:30 Asia/Tokyo",
    "tz now in IST,Stockholm,PT,JST",
    "tz 1700000000",
  ],
  run(args) {
    const trimmed = args.trim();
    if (!trimmed) {
      return err(
        "Missing input.",
        "Try: tz now  ·  tz 9am IST  ·  tz 2026-04-20 15:30 Asia/Tokyo",
      );
    }

    // Optional "in <zone1>,<zone2>,..." suffix to override target zones
    let inputPart = trimmed;
    let customZones: { label: string; tz: string }[] | null = null;
    const inMatch = trimmed.match(/^(.*?)\s+in\s+([\w/,\-+\s]+)$/i);
    if (inMatch) {
      const [, head, zonesRaw] = inMatch;
      const zoneTokens = zonesRaw.split(/[, ]+/).map((z) => z.trim()).filter(Boolean);
      const resolved: { label: string; tz: string }[] = [];
      const unknown: string[] = [];
      for (const tok of zoneTokens) {
        const z = normalizeZone(tok);
        if (z) resolved.push({ label: tok.toUpperCase(), tz: z });
        else unknown.push(tok);
      }
      if (unknown.length > 0) {
        return err(
          `Unknown timezone${unknown.length > 1 ? "s" : ""}: ${unknown.join(", ")}`,
          "Use IANA names (Asia/Tokyo) or shortcuts (IST, PT, ET, JST, SGT, GST, AET, …).",
        );
      }
      if (resolved.length > 0) {
        customZones = resolved;
        inputPart = head.trim();
      }
    }

    const parsed = parseInput(inputPart);
    if ("error" in parsed) return err(parsed.error);

    const zones = customZones ?? DEFAULT_ZONES;
    const local = localTz();
    const includesLocal = zones.some((z) => z.tz === local);
    const sourceParts = partsInZone(parsed.date, parsed.sourceZone);

    const lines: OutputLine[] = [
      { text: "input:", kind: "label" },
      { text: `  ${parsed.description}`, kind: "muted" },
      { text: "instant:", kind: "label" },
      { text: `  ${parsed.date.toISOString()}  (epoch ${Math.floor(parsed.date.getTime() / 1000)})`, kind: "code", copyable: true },
      { text: customZones ? "in requested zones:" : "in major timezones:", kind: "label" },
    ];

    // Source zone always shown first
    lines.push({
      text: `  ${"SOURCE".padEnd(20)}${fmtZone(parsed.date, parsed.sourceZone)}  ·  ${parsed.sourceZone}`,
      kind: "info",
    });

    const seen = new Set<string>([parsed.sourceZone]);
    for (const z of zones) {
      if (seen.has(z.tz)) continue;
      seen.add(z.tz);
      const p = partsInZone(parsed.date, z.tz);
      const delta = fmtOffsetDelta(p.offsetMinutes, sourceParts.offsetMinutes);
      const isLocal = z.tz === local;
      lines.push({
        text: `  ${(z.label + (isLocal ? " *" : "")).padEnd(20)}${fmtZone(parsed.date, z.tz)}  ·  ${delta}`,
        kind: isLocal ? "success" : "default",
      });
    }

    if (!customZones && !includesLocal && local !== parsed.sourceZone) {
      const p = partsInZone(parsed.date, local);
      const delta = fmtOffsetDelta(p.offsetMinutes, sourceParts.offsetMinutes);
      lines.push({
        text: `  ${("Your local *").padEnd(20)}${fmtZone(parsed.date, local)}  ·  ${delta}`,
        kind: "success",
      });
    }

    lines.push({
      text: "* = your local timezone · DST is auto-applied where applicable.",
      kind: "muted",
    });

    return ok(lines);
  },
};
