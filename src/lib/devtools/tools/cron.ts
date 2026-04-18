import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";
import { type Tool, type OutputLine, ok, err } from "../types";

const NAMED: Record<string, { expr: string; meaning: string }> = {
  "@yearly": { expr: "0 0 1 1 *", meaning: "Once a year at midnight on Jan 1" },
  "@annually": { expr: "0 0 1 1 *", meaning: "Once a year at midnight on Jan 1" },
  "@monthly": { expr: "0 0 1 * *", meaning: "Once a month at midnight on the 1st" },
  "@weekly": { expr: "0 0 * * 0", meaning: "Once a week at midnight on Sunday" },
  "@daily": { expr: "0 0 * * *", meaning: "Once a day at midnight" },
  "@midnight": { expr: "0 0 * * *", meaning: "Once a day at midnight" },
  "@hourly": { expr: "0 * * * *", meaning: "Once an hour at the top of the hour" },
};

// Natural-language → cron expression for common patterns. Best-effort.
function toCron(desc: string): string | null {
  const s = desc.toLowerCase().trim();

  // Named shortcuts first
  for (const [name, def] of Object.entries(NAMED)) {
    if (s === name || s === name.slice(1)) return def.expr;
  }

  if (/^every\s+minute$/.test(s)) return "* * * * *";
  if (/^every\s+hour$/.test(s)) return "0 * * * *";
  if (/^every\s+day$/.test(s) || /^daily$/.test(s)) return "0 0 * * *";
  if (/^every\s+week$/.test(s) || /^weekly$/.test(s)) return "0 0 * * 0";
  if (/^every\s+month$/.test(s) || /^monthly$/.test(s)) return "0 0 1 * *";
  if (/^every\s+year$/.test(s) || /^yearly$/.test(s)) return "0 0 1 1 *";

  // every N minutes/hours
  const everyN = s.match(/^every\s+(\d+)\s+(minute|minutes|hour|hours)$/);
  if (everyN) {
    const n = Number(everyN[1]);
    const unit = everyN[2].startsWith("minute") ? "minute" : "hour";
    if (unit === "minute") return `*/${n} * * * *`;
    return `0 */${n} * * *`;
  }

  // "every day at HH(:MM)?(am|pm)?"
  const dailyAt = s.match(/^every\s+day\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (dailyAt) {
    let h = Number(dailyAt[1]);
    const m = dailyAt[2] ? Number(dailyAt[2]) : 0;
    const ampm = dailyAt[3];
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    return `${m} ${h} * * *`;
  }

  // "every <day> at HH(:MM)?(am|pm)?"
  const days: Record<string, number> = {
    sunday: 0, sun: 0,
    monday: 1, mon: 1,
    tuesday: 2, tue: 2, tues: 2,
    wednesday: 3, wed: 3,
    thursday: 4, thu: 4, thurs: 4,
    friday: 5, fri: 5,
    saturday: 6, sat: 6,
  };
  const dow = s.match(/^every\s+(\w+)(?:s)?\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (dow && days[dow[1]] !== undefined) {
    let h = Number(dow[2]);
    const m = dow[3] ? Number(dow[3]) : 0;
    const ampm = dow[4];
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    return `${m} ${h} * * ${days[dow[1]]}`;
  }

  // "weekdays at HH(:MM)?(am|pm)?"
  const wd = s.match(/^(weekdays?|every\s+weekday)\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (wd) {
    let h = Number(wd[2]);
    const m = wd[3] ? Number(wd[3]) : 0;
    const ampm = wd[4];
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    return `${m} ${h} * * 1-5`;
  }

  return null;
}

function looksLikeCron(s: string): boolean {
  if (s.startsWith("@")) return true;
  const parts = s.split(/\s+/);
  if (parts.length !== 5 && parts.length !== 6) return false;
  return parts.every((p) => /^[\d*\-,/?LWa-zA-Z#]+$/.test(p));
}

function explainExpr(expr: string): { explanation: string; nextRuns: string[] } | { error: string } {
  const resolved = NAMED[expr]?.expr ?? expr;
  let explanation: string;
  try {
    explanation = cronstrue.toString(resolved, { use24HourTimeFormat: false, verbose: false });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to parse cron expression" };
  }
  const nextRuns: string[] = [];
  try {
    const interval = CronExpressionParser.parse(resolved, { tz: Intl.DateTimeFormat().resolvedOptions().timeZone });
    for (let i = 0; i < 5; i++) {
      nextRuns.push(interval.next().toDate().toLocaleString());
    }
  } catch {
    // ignore — cronstrue worked but parser couldn't enumerate (e.g. some quartz extensions)
  }
  return { explanation, nextRuns };
}

export const cronTool: Tool = {
  name: "cron",
  category: "lookup",
  description: "Explain a cron expression OR generate one from natural language.",
  usage: "cron <expression | description>",
  examples: [
    "cron */15 9-17 * * 1-5",
    "cron 0 0 * * 0",
    "cron @daily",
    "cron every 15 minutes",
    "cron every monday at 9am",
    "cron weekdays at 5pm",
  ],
  run(args) {
    const trimmed = args.trim();
    if (!trimmed) {
      return err(
        "Missing input.",
        "Try a cron expression like `*/15 * * * *` or describe it like `every weekday at 9am`.",
      );
    }

    let mode: "explain" | "build";
    let expr: string;
    let derivedFrom: string | null = null;

    if (looksLikeCron(trimmed)) {
      mode = "explain";
      expr = NAMED[trimmed]?.expr ?? trimmed;
      if (NAMED[trimmed]) derivedFrom = trimmed;
    } else {
      mode = "build";
      const built = toCron(trimmed);
      if (!built) {
        return err(
          `Couldn't translate "${trimmed}" into cron.`,
          "Supported phrasings: `every N minutes`, `every day at HH(am|pm)`, `every monday at 9am`, `weekdays at 5pm`, `@daily`, etc. Or paste a cron expression directly.",
        );
      }
      expr = built;
      derivedFrom = trimmed;
    }

    const result = explainExpr(expr);
    if ("error" in result) {
      return err(`Invalid cron expression: ${result.error}`);
    }

    const lines: OutputLine[] = [];
    if (mode === "build") {
      lines.push({ text: "input:", kind: "label" });
      lines.push({ text: `  "${derivedFrom}"`, kind: "muted" });
      lines.push({ text: "generated cron:", kind: "label" });
      lines.push({ text: expr, kind: "code", copyable: true });
    } else {
      lines.push({ text: "expression:", kind: "label" });
      lines.push({
        text: derivedFrom ? `  ${derivedFrom}  →  ${expr}` : `  ${expr}`,
        kind: "code",
        copyable: true,
      });
    }

    lines.push({ text: "meaning:", kind: "label" });
    lines.push({ text: `  ${result.explanation}`, kind: "info" });

    if (result.nextRuns.length > 0) {
      lines.push({ text: `next ${result.nextRuns.length} runs (local time):`, kind: "label" });
      for (const r of result.nextRuns) {
        lines.push({ text: `  • ${r}`, kind: "default" });
      }
    } else {
      lines.push({
        text: "note: couldn't enumerate next runs (extension syntax not supported by parser).",
        kind: "muted",
      });
    }

    lines.push({
      text: "format: minute hour day-of-month month day-of-week",
      kind: "muted",
    });

    return ok(lines);
  },
};
