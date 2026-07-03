import { clsx } from "clsx";

type Status = "draft" | "review" | "revisions" | "approved" | "overdue";

const STYLES: Record<Status, string> = {
  draft: "bg-ink/5 text-ink/60",
  review: "bg-amber/25 text-amber-dark",
  revisions: "bg-correction-light text-correction",
  approved: "bg-sage-light text-sage",
  overdue: "bg-correction-light text-correction",
};

const LABELS: Record<Status, string> = {
  draft: "Draft",
  review: "Adviser review",
  revisions: "Needs revisions",
  approved: "Approved",
  overdue: "Overdue",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans",
        STYLES[status]
      )}
    >
      {LABELS[status]}
    </span>
  );
}
