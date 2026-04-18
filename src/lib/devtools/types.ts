export type LineKind =
  | "default"
  | "muted"
  | "success"
  | "error"
  | "warn"
  | "info"
  | "label"
  | "code"
  | "prompt";

export interface OutputLine {
  text: string;
  kind?: LineKind;
  copyable?: boolean;
  prefix?: string;
}

export interface ToolResult {
  status: "ok" | "error" | "info";
  lines: OutputLine[];
}

export type ToolCategory = "encode" | "decode" | "lookup" | "validate" | "meta";

export interface Tool {
  name: string;
  description: string;
  usage: string;
  examples: string[];
  category: ToolCategory;
  run: (args: string) => ToolResult | Promise<ToolResult>;
}

export const ok = (lines: OutputLine[]): ToolResult => ({ status: "ok", lines });
export const err = (message: string, hint?: string): ToolResult => ({
  status: "error",
  lines: hint
    ? [
        { text: message, kind: "error" },
        { text: hint, kind: "muted" },
      ]
    : [{ text: message, kind: "error" }],
});
export const info = (lines: OutputLine[]): ToolResult => ({
  status: "info",
  lines,
});
