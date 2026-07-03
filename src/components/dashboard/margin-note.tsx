import { MessageSquare } from "lucide-react";

type Note = {
  chapter: string;
  note: string;
  date: string;
};

export function MarginNote({ note }: { note: Note }) {
  return (
    <div className="margin-note py-1.5">
      <div className="flex items-center gap-2 text-correction text-xs font-medium mb-0.5">
        <MessageSquare size={13} strokeWidth={2} />
        <span>{note.chapter}</span>
        <span className="text-ink/35 font-normal font-mono">
          {note.date}
        </span>
      </div>
      <p className="text-sm text-ink/80">{note.note}</p>
    </div>
  );
}
