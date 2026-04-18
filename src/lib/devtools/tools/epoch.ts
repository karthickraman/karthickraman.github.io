import { type Tool, type OutputLine, ok, err } from "../types";

const TIMEZONES: { label: string; tz: string }[] = [
  { label: "UTC", tz: "UTC" },
  { label: "Local", tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { label: "IST (Kolkata)", tz: "Asia/Kolkata" },
  { label: "PT (Los Angeles)", tz: "America/Los_Angeles" },
  { label: "ET (New York)", tz: "America/New_York" },
  { label: "GMT (London)", tz: "Europe/London" },
  { label: "JST (Tokyo)", tz: "Asia/Tokyo" },
];

function fmtIn(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "shortOffset",
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

function relative(ts: number): string {
  const diffMs = ts - Date.now();
  const abs = Math.abs(diffMs);
  const units: [number, string, string][] = [
    [1000, "second", "seconds"],
    [60_000, "minute", "minutes"],
    [3_600_000, "hour", "hours"],
    [86_400_000, "day", "days"],
    [86_400_000 * 30, "month", "months"],
    [86_400_000 * 365, "year", "years"],
  ];
  let unit: [number, string, string] = units[0];
  for (const u of units) if (abs >= u[0]) unit = u;
  const value = Math.round(abs / unit[0]);
  const word = value === 1 ? unit[1] : unit[2];
  if (Math.round(abs / 1000) < 5) return "just now";
  return diffMs > 0 ? `in ${value} ${word}` : `${value} ${word} ago`;
}

function detectInputUnit(n: number): "s" | "ms" | "us" | "ns" {
  const abs = Math.abs(n);
  if (abs >= 1e16) return "ns";
  if (abs >= 1e13) return "us";
  if (abs >= 1e11) return "ms";
  return "s";
}

function parseInput(raw: string): { date: Date; source: string } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (/^now$/i.test(trimmed)) {
    return { date: new Date(), source: "now" };
  }

  // Numeric epoch (auto-detect unit)
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const n = Number(trimmed);
    const unit = detectInputUnit(n);
    let ms: number;
    switch (unit) {
      case "s":
        ms = n * 1000;
        break;
      case "ms":
        ms = n;
        break;
      case "us":
        ms = n / 1000;
        break;
      case "ns":
        ms = n / 1_000_000;
        break;
    }
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return null;
    return { date: d, source: `epoch (${unit})` };
  }

  // ISO / RFC 2822 / human-readable date string
  const d = new Date(trimmed);
  if (!Number.isNaN(d.getTime())) {
    return { date: d, source: "parsed date string" };
  }
  return null;
}

export const epochTool: Tool = {
  name: "epoch",
  category: "lookup",
  description: "Convert epoch ↔ human-readable time across timezones. No args = now.",
  usage: "epoch [timestamp | iso-date]",
  examples: [
    "epoch",
    "epoch now",
    "epoch 1700000000",
    "epoch 1700000000000",
    "epoch 2026-04-18T12:30:00Z",
  ],
  run(args) {
    const trimmed = args.trim();

    let date: Date;
    let source: string;
    if (!trimmed) {
      date = new Date();
      source = "current time";
    } else {
      const parsed = parseInput(trimmed);
      if (!parsed) {
        return err(
          `Couldn't parse: ${trimmed}`,
          "Try: epoch 1700000000  ·  epoch 2026-04-18T12:30:00Z  ·  epoch (no args)",
        );
      }
      date = parsed.date;
      source = parsed.source;
    }

    const ms = date.getTime();
    const seconds = Math.floor(ms / 1000);

    const lines: OutputLine[] = [
      { text: `source: ${source}`, kind: "muted" },
      { text: relative(ms), kind: "info" },
      { text: "epoch:", kind: "label" },
      { text: `  seconds:      ${seconds}`, kind: "code", copyable: true },
      { text: `  milliseconds: ${ms}`, kind: "code", copyable: true },
      { text: "iso 8601:", kind: "label" },
      { text: `  ${date.toISOString()}`, kind: "code", copyable: true },
      { text: "timezones:", kind: "label" },
    ];

    const seen = new Set<string>();
    for (const z of TIMEZONES) {
      if (seen.has(z.tz)) continue;
      seen.add(z.tz);
      lines.push({
        text: `  ${z.label.padEnd(18)} ${fmtIn(date, z.tz)}`,
        kind: "default",
      });
    }

    return ok(lines);
  },
};
