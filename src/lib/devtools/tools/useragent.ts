import { UAParser } from "ua-parser-js";
import { type Tool, type OutputLine, ok } from "../types";

function pad(label: string): string {
  return (label + ":").padEnd(11);
}

function fallback(value: string | undefined, def = "—"): string {
  return value && value.trim() ? value : def;
}

export const useragentTool: Tool = {
  name: "useragent",
  category: "lookup",
  description: "Parse a User-Agent string into browser, engine, OS, device, CPU.",
  usage: "useragent [ua-string]",
  examples: [
    "useragent",
    "useragent Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15",
  ],
  run(args) {
    const trimmed = args.trim();
    const useOwn = !trimmed;
    const ua =
      trimmed ||
      (typeof navigator !== "undefined" ? navigator.userAgent : "Mozilla/5.0");

    const result = new UAParser(ua).getResult();

    const browser = `${fallback(result.browser.name)} ${fallback(result.browser.version, "")}`.trim();
    const engine = `${fallback(result.engine.name)} ${fallback(result.engine.version, "")}`.trim();
    const os = `${fallback(result.os.name)} ${fallback(result.os.version, "")}`.trim();
    const deviceType = fallback(result.device.type, "desktop");
    const deviceName = [result.device.vendor, result.device.model].filter(Boolean).join(" ");
    const cpu = fallback(result.cpu.architecture);

    const lines: OutputLine[] = [
      {
        text: useOwn ? "parsing your browser's user-agent…" : "parsing provided user-agent…",
        kind: "muted",
      },
      { text: "input:", kind: "label" },
      { text: ua, kind: "code", copyable: true },
      { text: "parsed:", kind: "label" },
      { text: `  ${pad("browser")} ${browser}`, kind: "default" },
      { text: `  ${pad("engine")} ${engine}`, kind: "default" },
      { text: `  ${pad("os")} ${os}`, kind: "default" },
      {
        text: `  ${pad("device")} ${deviceType}${deviceName ? `  (${deviceName})` : ""}`,
        kind: "default",
      },
      { text: `  ${pad("cpu")} ${cpu}`, kind: "default" },
    ];

    // Add browser-side environment when reading the visitor's own UA
    if (useOwn && typeof window !== "undefined") {
      const screen = `${window.screen.width}×${window.screen.height} @ ${window.devicePixelRatio || 1}x`;
      const viewport = `${window.innerWidth}×${window.innerHeight}`;
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const lang = navigator.language;
      const cookies = navigator.cookieEnabled ? "enabled" : "disabled";
      const online = navigator.onLine ? "online" : "offline";
      type NavigatorWithMemory = Navigator & { deviceMemory?: number; hardwareConcurrency?: number };
      const nav = navigator as NavigatorWithMemory;

      lines.push(
        { text: "environment:", kind: "label" },
        { text: `  ${pad("screen")} ${screen}`, kind: "default" },
        { text: `  ${pad("viewport")} ${viewport}`, kind: "default" },
        { text: `  ${pad("timezone")} ${tz}`, kind: "default" },
        { text: `  ${pad("language")} ${lang}`, kind: "default" },
        { text: `  ${pad("cookies")} ${cookies}`, kind: "default" },
        { text: `  ${pad("network")} ${online}`, kind: "default" },
      );
      if (nav.hardwareConcurrency) {
        lines.push({
          text: `  ${pad("cpu cores")} ${nav.hardwareConcurrency}`,
          kind: "default",
        });
      }
      if (nav.deviceMemory) {
        lines.push({
          text: `  ${pad("memory")} ${nav.deviceMemory} GB`,
          kind: "default",
        });
      }
    }

    return ok(lines);
  },
};
