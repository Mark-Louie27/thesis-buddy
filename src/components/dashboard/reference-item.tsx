import { Card } from "@/components/ui/card";
import type { ReferenceEntry } from "@/types";

export function ReferenceItem({ reference }: { reference: ReferenceEntry }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-ink leading-relaxed">
        {reference.apaReference}
      </p>
      <p className="font-mono text-xs text-ink/45 mt-2">
        {reference.apaInText}
      </p>
    </Card>
  );
}
