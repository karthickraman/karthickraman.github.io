import { type Tool, ok, err } from "../types";

function utf8Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function utf8Decode(input: string): string {
  const binary = atob(input.replace(/\s+/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function looksLikeBase64(s: string): boolean {
  const trimmed = s.replace(/\s+/g, "");
  if (trimmed.length === 0 || trimmed.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/]+=*$/.test(trimmed);
}

export const base64Tool: Tool = {
  name: "base64",
  category: "encode",
  description: "Encode or decode Base64 (auto-detects direction).",
  usage: "base64 <text>",
  examples: [
    "base64 hello world",
    "base64 aGVsbG8gd29ybGQ=",
    "base64 encode hello",
    "base64 decode aGVsbG8=",
  ],
  run(args) {
    const trimmed = args.trim();
    if (!trimmed) {
      return err("Missing input.", "Try: base64 hello world");
    }

    let mode: "auto" | "encode" | "decode" = "auto";
    let payload = trimmed;
    const firstWord = trimmed.split(/\s+/)[0]?.toLowerCase();
    if (firstWord === "encode" || firstWord === "decode") {
      mode = firstWord;
      payload = trimmed.slice(firstWord.length).trim();
      if (!payload) return err(`Missing input after "${firstWord}".`);
    }

    const tryDecode = mode === "decode" || (mode === "auto" && looksLikeBase64(payload));

    if (tryDecode) {
      try {
        const decoded = utf8Decode(payload);
        return ok([
          { text: "decoded:", kind: "label" },
          { text: decoded, kind: "code", copyable: true },
        ]);
      } catch {
        if (mode === "decode") return err("Invalid Base64 input.");
      }
    }

    try {
      const encoded = utf8Encode(payload);
      return ok([
        { text: "encoded:", kind: "label" },
        { text: encoded, kind: "code", copyable: true },
      ]);
    } catch (e) {
      return err(
        "Failed to encode input.",
        e instanceof Error ? e.message : undefined,
      );
    }
  },
};
