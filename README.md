# Personal Editorial Engine

A long-term, topic-agnostic research and publishing system for turning raw material into rigorous, human editorial writing, interactive data stories, and channel-ready outputs.

## Product principles

- Argument first, not template first.
- Evidence is checked privately before publication.
- AI-generated material is treated as a research lead, never as a source of truth.
- The editor can ignore warnings and continue.
- Personalisation is explicit and learned from approved examples.
- Public reading should feel calm, serious, and editorial rather than like a dashboard.
- The public website is the canonical archive; Substack, LinkedIn, Medium and YouTube are distribution channels.
- Core architecture should remain usable without paid model APIs.

## V1 scope

- Public publication homepage
- Long-form article reader
- Warm / light / dark reading modes
- Typeface and text-size controls
- Interactive chart component
- Private editorial workspace
- Raw-vs-edited comparison
- Evidence flags and editorial questions
- Editorial constitution
- Platform-ready export architecture (Substack, LinkedIn, Medium, YouTube script)

## Stack

- Next.js
- React
- TypeScript
- CSS variables for the design system
- Browser-local reader preferences and annotations in V1

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Status

Early V1 foundation. The next milestones are ingestion, claim/evidence ledger, anti-AI editing rules, article persistence, annotations, chart builder, and channel exports.
