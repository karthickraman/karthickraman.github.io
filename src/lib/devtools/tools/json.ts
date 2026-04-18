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

function typeTag(v: unknown): "null" | "array" | "object" | "primitive" {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "object") return "object";
  return "primitive";
}

function walkDiff(a: unknown, b: unknown, path: string, lines: OutputLine[]): void {
  const ta = typeTag(a);
  const tb = typeTag(b);
  if (ta !== tb) {
    lines.push({
      text: `~ ${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}  (${ta} → ${tb})`,
      kind: "warn",
    });
    return;
  }

  if (ta === "null" || ta === "primitive") {
    if (a !== b) {
      lines.push({
        text: `~ ${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`,
        kind: "warn",
      });
    }
    return;
  }

  if (ta === "array") {
    const aa = a as unknown[];
    const bb = b as unknown[];
    if (aa.length !== bb.length) {
      lines.push({
        text: `~ ${path}: array length ${aa.length} → ${bb.length}`,
        kind: "warn",
      });
    }
    const n = Math.max(aa.length, bb.length);
    for (let i = 0; i < n; i++) {
      const p = `${path}[${i}]`;
      if (i >= aa.length) {
        lines.push({ text: `+ ${p}: ${JSON.stringify(bb[i])}`, kind: "success" });
      } else if (i >= bb.length) {
        lines.push({ text: `- ${p}: ${JSON.stringify(aa[i])}`, kind: "error" });
      } else {
        walkDiff(aa[i], bb[i], p, lines);
      }
    }
    return;
  }

  const oa = a as Record<string, unknown>;
  const ob = b as Record<string, unknown>;
  const keys = new Set([...Object.keys(oa), ...Object.keys(ob)]);
  for (const k of [...keys].sort()) {
    const p = path === "$" ? `$.${k}` : `${path}.${k}`;
    if (!(k in oa)) {
      lines.push({ text: `+ ${p}: ${JSON.stringify(ob[k])}`, kind: "success" });
    } else if (!(k in ob)) {
      lines.push({ text: `- ${p}: ${JSON.stringify(oa[k])}`, kind: "error" });
    } else {
      walkDiff(oa[k], ob[k], p, lines);
    }
  }
}

export const jsonTool: Tool = {
  name: "json",
  category: "validate",
  description: "Pretty-print and validate JSON. Reports line/column on error.",
  usage: "json <text>  |  json minify <text>  |  json sort <text>  |  json diff <a>↵---↵<b>",
  examples: [
    'json {"name":"karthick","skills":["java","go"]}',
    'json minify {"a": 1, "b": 2}',
    'json sort {"z":1,"a":2}',
    "json diff {\"a\":1}\n---\n{\"a\":1,\"b\":2}",
  ],
  run(args) {
    const trimmed = args.trim();
    if (!trimmed) return err("Missing JSON input.");

    const first = trimmed.split(/\s+/)[0]?.toLowerCase();

    if (first === "diff") {
      const firstWord = trimmed.split(/\s+/)[0] ?? "diff";
      const payload = trimmed.slice(firstWord.length).trim();
      const chunks = payload.split(/\n---\s*\r?\n/);
      if (chunks.length !== 2) {
        return err(
          "json diff expects two JSON documents separated by a line containing only ---.",
          "Example: first JSON, blank line optional, a line with exactly ---, then the second JSON.",
        );
      }
      const [leftRaw, rightRaw] = chunks.map((s) => s.trim());
      if (!leftRaw || !rightRaw) {
        return err("json diff needs non-empty JSON on both sides of ---.");
      }
      let left: unknown;
      let right: unknown;
      try {
        left = JSON.parse(leftRaw);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Parse error";
        return err(`left JSON: ${message}`);
      }
      try {
        right = JSON.parse(rightRaw);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Parse error";
        return err(`right JSON: ${message}`);
      }
      const lines: OutputLine[] = [{ text: "structural diff (left → right):", kind: "label" }];
      walkDiff(left, right, "$", lines);
      if (lines.length === 1) {
        lines.push({ text: "no differences — structurally identical.", kind: "success" });
      }
      return ok(lines);
    }

    let mode: "pretty" | "minify" | "sort" = "pretty";
    let payload = trimmed;
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
