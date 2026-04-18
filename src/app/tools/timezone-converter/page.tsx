import { TOOLS_CONTENT_BY_SLUG, buildToolMetadata } from "@/lib/tools-content";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { TimezoneWorldClock } from "@/components/tools/TimezoneWorldClock";

const SLUG = "timezone-converter";

export const metadata = buildToolMetadata(SLUG);

export default function Page() {
  return (
    <ToolPageShell
      tool={TOOLS_CONTENT_BY_SLUG[SLUG]}
      beforeWidget={<TimezoneWorldClock />}
    />
  );
}
