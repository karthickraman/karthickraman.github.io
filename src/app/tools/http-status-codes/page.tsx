import { TOOLS_CONTENT_BY_SLUG, buildToolMetadata } from "@/lib/tools-content";
import { ToolPageShell } from "@/components/tools/ToolPageShell";

const SLUG = "http-status-codes";

export const metadata = buildToolMetadata(SLUG);

export default function Page() {
  return <ToolPageShell tool={TOOLS_CONTENT_BY_SLUG[SLUG]} />;
}
