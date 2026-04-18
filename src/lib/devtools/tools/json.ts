import { type Tool, type OutputLine, ok, err } from "../types";

function locate(input: string, position: number): { line: number; column: number } {
  const upto = input.slice(0, Math.max(0, Math.min(position, input.length)));
  const lines = upto.split("\n");
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

function extractPosition(message: string): number | undefined {
  const m = message.match(/position\s+(\d+)/i);
  return m ? Number(m[1]) : undefined;
}

export const jsonTool: Tool = {
  name: "json",
  category: "validate",
  description: "Pretty-print and validate JSON. Reports line/column on error.",
  usage: "json <text>  |  json minify <text>  |  json sort <text>",
  examples: [
    'json {"name":"karthick","skills":["java","go"]}',
    'json minify {"a": 1, "b": 2}',
    'json sort {"z":1,"a":2}',
  ],
  run(args) {
    const trimmed = args.trim();
    if (!trimmed) return err("Missing JSON input.");

    let mode: "pretty" | "minify" | "sort" = "pretty";
    let payload = trimmed;
    const first = trimmed.split(/\s+/)[0]?.toLowerCase();
    if (first === "minify" || first === "sort" || first === "pretty") {
      mode = first === "pretty" ? "pretty" : (first as "minify" | "sort");
      payload = trimmed.slice(first.length).trim();
      if (!payload) return err(`Missing JSON after "${first}".`);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(payload);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Parse error";
      const pos = extractPosition(message);
      const lines: OutputLine[] = [{ text: `parse error: ${message}`, kind: "error" }];
      if (pos !== undefined) {
        const { line, column } = locate(payload, pos);
        lines.push({
          text: `at line ${line}, column ${column}`,
          kind: "muted",
        });
        const sourceLines = payload.split("\n");
        const target = sourceLines[line - 1] ?? "";
        lines.push({ text: target, kind: "code" });
        lines.push({
          text: " ".repeat(Math.max(0, column - 1)) + "^",
          kind: "warn",
        });
      }
      return { status: "error", lines };
    }

    const sortKeys = (value: unknown): unknown => {
      if (Array.isArray(value)) return value.map(sortKeys);
      if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        return Object.keys(obj)
          .sort()
          .reduce<Record<string, unknown>>((acc, k) => {
            acc[k] = sortKeys(obj[k]);
            return acc;
          }, {});
      }
      return value;
    };

    const target = mode === "sort" ? sortKeys(parsed) : parsed;
    const formatted =
      mode === "minify" ? JSON.stringify(target) : JSON.stringify(target, null, 2);

    const stats = {
      bytes: new TextEncoder().encode(formatted).length,
      keys: typeof target === "object" && target !== null ? Object.keys(target).length : 0,
      type: Array.isArray(target) ? "array" : target === null ? "null" : typeof target,
    };

    return ok([
      { text: `valid · ${stats.type} · ${stats.bytes} bytes`, kind: "success" },
      { text: formatted, kind: "code", copyable: true },
    ]);
  },
};
