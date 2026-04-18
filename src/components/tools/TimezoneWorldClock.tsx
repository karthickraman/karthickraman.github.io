"use client";

import { useCallback, useMemo, useState } from "react";

const DEFAULT_ZONES = [
  { id: "america-los_angeles", label: "Pacific", tz: "America/Los_Angeles" },
  { id: "utc", label: "GMT / UTC", tz: "UTC" },
  { id: "asia-kolkata", label: "India", tz: "Asia/Kolkata" },
  { id: "america-chicago", label: "Memphis (Central)", tz: "America/Chicago" },
] as const;

const SLIDER_MAX = 24 * 60 - 1;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Local calendar Y-M-D for `d` in the user's timezone. */
function localYmd(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${pad2(m)}-${pad2(day)}`;
}

/** Start of local calendar day for the given Y-M-D string (local TZ). */
function parseLocalDayStart(ymd: string): Date | null {
  const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(y, mo - 1, day, 0, 0, 0, 0);
  if (d.getFullYear() !== y || d.getMonth() !== mo - 1 || d.getDate() !== day) return null;
  return d;
}

function addLocalMinutes(dayStart: Date, minutesFromMidnight: number): Date {
  return new Date(dayStart.getTime() + minutesFromMidnight * 60_000);
}

function minutesFromLocalMidnight(instant: Date, dayStart: Date): number {
  return Math.round((instant.getTime() - dayStart.getTime()) / 60_000);
}

function formatZoneRow(instant: Date, tz: string): {
  time: string;
  offset: string;
  dateLine: string;
} {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(instant);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "shortOffset",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).formatToParts(instant);

  const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";

  return {
    time,
    offset: tzName.replace("GMT", "GMT "),
    dateLine: `${weekday}, ${month} ${day}, ${year}`,
  };
}

export function TimezoneWorldClock() {
  const [pickedDay, setPickedDay] = useState(() => localYmd(new Date()));
  const [minute, setMinute] = useState(() => {
    const start = parseLocalDayStart(localYmd(new Date()));
    if (!start) return 12 * 60;
    const m = minutesFromLocalMidnight(new Date(), start);
    return Math.min(SLIDER_MAX, Math.max(0, m));
  });

  const dayStart = useMemo(() => parseLocalDayStart(pickedDay), [pickedDay]);

  const instant = useMemo(() => {
    if (!dayStart) return new Date();
    return addLocalMinutes(dayStart, minute);
  }, [dayStart, minute]);

  const onSlider = useCallback(
    (value: number) => {
      const v = Math.min(SLIDER_MAX, Math.max(0, Math.round(value)));
      setMinute(v);
    },
    [],
  );

  const snapNow = useCallback(() => {
    const now = new Date();
    setPickedDay(localYmd(now));
    const start = parseLocalDayStart(localYmd(now));
    if (!start) return;
    const m = minutesFromLocalMidnight(now, start);
    setMinute(Math.min(SLIDER_MAX, Math.max(0, m)));
  }, []);

  const invalidDay = !dayStart;

  return (
    <section
      aria-labelledby="world-clock-heading"
      className="terminal-card space-y-5 rounded-xl border border-terminal-border bg-terminal-surface/80 p-4 shadow-xl sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="world-clock-heading"
            className="font-mono text-sm font-semibold uppercase tracking-wider text-terminal-cyan"
          >
            $ worldclock — multi-zone
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-terminal-muted">
            Drag the slider to scrub through the same calendar day in your local timezone. Every row
            shows that exact instant, like a synced world clock.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 font-mono text-xs text-terminal-muted">
            <span className="shrink-0">day</span>
            <input
              type="date"
              value={pickedDay}
              onChange={(e) => setPickedDay(e.target.value)}
              className="rounded-md border border-terminal-border bg-terminal-bg/70 px-2 py-1.5 font-mono text-xs text-terminal-body focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent"
            />
          </label>
          <button
            type="button"
            onClick={snapNow}
            className="rounded-md border border-terminal-accent/40 bg-terminal-accent/10 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-terminal-accent transition hover:bg-terminal-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
          >
            now
          </button>
        </div>
      </div>

      {invalidDay ? (
        <p className="text-sm text-terminal-red">Invalid date — pick a valid calendar day.</p>
      ) : (
        <>
          <div className="space-y-3">
            {DEFAULT_ZONES.map((z) => {
              const row = formatZoneRow(instant, z.tz);
              return (
                <div
                  key={z.id}
                  className="rounded-lg border border-terminal-border bg-terminal-bg/35 px-3 py-3 sm:px-4"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-terminal-muted">
                        {z.label}
                      </p>
                      <p className="font-mono text-[11px] text-terminal-muted/80">{z.tz}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-mono text-xl font-semibold tabular-nums text-terminal-body sm:text-2xl">
                        {row.time}
                      </p>
                      <p className="font-mono text-xs text-terminal-muted">
                        {row.offset} · {row.dateLine}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 rounded-lg border border-terminal-border/80 bg-terminal-bg/25 p-3">
            <div className="flex items-center justify-between font-mono text-[11px] text-terminal-muted">
              <span>scrub local day</span>
              <span className="tabular-nums text-terminal-body">
                {pad2(Math.floor(minute / 60))}:{pad2(minute % 60)}
              </span>
            </div>
            <label className="block">
              <span className="sr-only">Minutes from local midnight — updates all zones</span>
              <input
                type="range"
                min={0}
                max={SLIDER_MAX}
                step={1}
                value={minute}
                onChange={(e) => onSlider(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-terminal-border/60 accent-terminal-accent"
              />
            </label>
          </div>

          <p className="font-mono text-[11px] leading-relaxed text-terminal-muted">
            The slider sets the time on <span className="text-terminal-body">{pickedDay}</span> in
            your local timezone; every row shows that same instant (
            <span className="break-all text-terminal-body">{instant.toISOString()}</span>). For
            phrases like <span className="text-terminal-cyan">9am PST in IST</span>, use the
            terminal widget below.
          </p>
        </>
      )}
    </section>
  );
}
