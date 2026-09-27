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

## Original HTML article: Pakistan SME credit

`/article/pakistan-sme-credit-since-2013` serves the exact uploaded HTML from
`content/articles/pakistan-sme-credit-since-2013.html`, including its own CSS and
interactive scripts. The file is intentionally outside `public/` so there is no
static website URL that bypasses the publication controls.

Open `/editor/publications` and find the article by its full question title.
**Mark working** labels its research listing as work in progress; **Hide / archive**
removes the listing and makes the article URL return 404; **Restore** or
**Mark published** makes it public again. State changes use the existing Supabase
publication registry and do not require a redeployment. The original article
design stays unchanged in every public state. The HTML source remains in this
public GitHub repository even when hidden on the website.

To replace the article, update the HTML file in GitHub and commit to `main`;
the connected Vercel deployment publishes it. Keep the publication slug unchanged.

Early V1 foundation. The next milestones are ingestion, claim/evidence ledger, anti-AI editing rules, article persistence, annotations, chart builder, and channel exports.
