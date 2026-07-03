# Thesis Buddy

Reference management, RRL synthesis, milestone tracking, and APA 7th
formatting for Filipino thesis and capstone students.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (Postgres + Auth + Storage)
- Groq (Llama 3.3 70B) for metadata extraction and RRL synthesis
- `docx` for exported Word document generation

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase + Groq keys
npm run dev
```

Visit http://localhost:3000

## What's built so far

- Landing page
- Dashboard shell (sidebar nav, overview page with chapter cards,
  adviser feedback panel, stats)
- `/api/extract-metadata` — pastes/DOI/URL to APA 7th citation via Groq
- Design tokens in `src/app/globals.css` (Tailwind v4 `@theme`)

## Next up

- Supabase schema + auth (login/signup pages are stubbed, empty)
- Chapters detail page (per-chapter editor + feedback thread)
- References page (list + add-reference flow wired to the API route)
- Milestones page (kanban: Draft → Adviser Review → Revisions → Approved)
- RRL synthesis endpoint (`/api/rrl-synthesis`)
- DOCX formatter (`/api/format-docx`) — reuses your existing
  PRMSU DOCX XML-manipulation approach for ToC/List of Tables/Figures

## Design tokens

| Token | Hex | Use |
|---|---|---|
| Ink Navy | `#14213D` | Text, headers |
| Paper | `#EEF1F5` | Background |
| Highlighter Amber | `#FFC857` | Accent, active states |
| Sage | `#4F7965` | Approved/success |
| Correction Red | `#9B2C2C` | Deadlines, adviser feedback |

Fonts: Fraunces (display), Inter (body), IBM Plex Mono (citations/dates).
