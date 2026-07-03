export type ChapterStatus = "draft" | "review" | "revisions" | "approved";

export interface Chapter {
  id: string;
  thesisId: string;
  number: number;
  title: string;
  status: ChapterStatus;
  wordCount: number;
  updatedAt: string;
}

export interface ReferenceEntry {
  id: string;
  thesisId: string;
  authors: string[];
  year: number | null;
  title: string;
  source: string | null;
  url: string | null;
  apaInText: string;
  apaReference: string;
}

export interface Milestone {
  id: string;
  thesisId: string;
  title: string;
  dueDate: string;
  status: "upcoming" | "done" | "overdue";
}

export interface AdviserFeedback {
  id: string;
  chapterId: string;
  note: string;
  createdAt: string;
  resolved: boolean;
}
