import { type Tool, type OutputLine, type ToolResult, ok, err } from "./types";
import { base64Tool } from "./tools/base64";
import { jwtTool } from "./tools/jwt";
import { jsonTool } from "./tools/json";
import { statusTool } from "./tools/status";
import { epochTool } from "./tools/epoch";
import { useragentTool } from "./tools/useragent";
import { cronTool } from "./tools/cron";
import { tzTool } from "./tools/tz";

export const TOOLS: Tool[] = [
  base64Tool,
  jwtTool,
  jsonTool,
  statusTool,
  epochTool,
  tzTool,
  useragentTool,
  cronTool,
];

const TOOL_MAP: Record<string, Tool> = TOOLS.reduce<Record<string, Tool>>(
  (acc, tool) => {
    acc[tool.name] = tool;
    return acc;
  },
  {},
);

export function getTool(name: string): Tool | undefined {
  return TOOL_MAP[name.toLowerCase()];
}

function helpResult(): ToolResult {
  const lines: OutputLine[] = [
    { text: "devtools — interactive developer utilities", kind: "label" },
    { text: "type a command, or run `tools` to see them as cards.", kind: "muted" },
    { text: "", kind: "muted" },
    { text: "available commands:", kind: "label" },
  ];
  for (const t of TOOLS) {
    lines.push({ text: `  ${t.name.padEnd(8)}  ${t.description}`, kind: "default" });
  }
  lines.push(
    { text: "", kind: "muted" },
    { text: "meta commands:", kind: "label" },
    { text: "  help      show this message", kind: "default" },
    { text: "  tools     show all tools as clickable cards", kind: "default" },
    { text: "  clear     clear the screen", kind: "default" },
    { text: "  exit      close the terminal", kind: "default" },
    { text: "", kind: "muted" },
    { text: "shortcuts: ⌘/Ctrl+K to open · Esc to close · ↑/↓ history", kind: "muted" },
  );
  return ok(lines);
}

export interface ExecutionResult extends ToolResult {
  control?: "clear" | "exit";
}

export async function execute(input: string): Promise<ExecutionResult> {
  const trimmed = input.trim();
  if (!trimmed) return ok([]);

  const [rawCmd, ...rest] = trimmed.split(/\s+/);
  const cmd = rawCmd.toLowerCase();
  const args = trimmed.slice(rawCmd.length).trim();

  switch (cmd) {
    case "help":
    case "?":
      return helpResult();
    case "clear":
    case "cls":
      return { ...ok([]), control: "clear" };
    case "exit":
    case "quit":
    case "close":
      return { ...ok([]), control: "exit" };
    case "tools":
      return ok([
        { text: "rendering tools palette…", kind: "muted" },
      ]);
  }

  const tool = getTool(cmd);
  if (!tool) {
    return err(
      `command not found: ${cmd}`,
      "type `help` to see available commands.",
    );
  }

  try {
    const result = await tool.run(args || rest.join(" "));
    return result;
  } catch (e) {
    return err(
      "tool crashed unexpectedly.",
      e instanceof Error ? e.message : undefined,
    );
  }
}
