"use client";

import { useMemo, useState } from "react";

const evidencePattern = /(?:\b\d+(?:\.\d+)?%\b|\b\d+(?:\.\d+)?\s?(?:GW|MW|billion|million|trillion)\b|\$\s?\d+)/gi;

function editorialPass(input: string) {
  return input
    .replace(/^\s*(One|Two|Three|Four|Five)\.\s*/gim, "")
    .replace(/\b(in a rapidly changing environment|unlock better outcomes|foster trust|it is important to note that|in today's world)\b/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function EditorPage() {
  const [raw, setRaw] = useState("");
  const [draft, setDraft] = useState("");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const evidenceFlags = useMemo(() => {
    const matches = draft.match(evidencePattern) ?? [];
    return Array.from(new Set(matches));
  }, [draft]);

  function createDraft() {
    if (!raw.trim()) return;
    setDraft(editorialPass(raw));
    setStep(2);
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-topbar">
        <div>
          <strong>Jamal Nasir</strong>
          <span>Editorial workspace</span>
        </div>
        <a href="/">View public site ↗</a>
      </header>

      <section className="workspace-wrap">
        <div className="workspace-heading">
          <div className="kicker">Private workspace</div>
          <h1>Turn research into a publishable article.</h1>
          <p>Start with the material you already have. The workflow keeps the writing, evidence check, preview and distribution separate so you always know what happens next.</p>
        </div>

        <div className="stepper" aria-label="Editorial workflow">
          {["Research", "Article", "Review", "Publish"].map((label, i) => {
            const number = i + 1;
            return (
              <button
                key={label}
                className={step === number ? "step active" : step > number ? "step done" : "step"}
                onClick={() => setStep(number as 1 | 2 | 3 | 4)}
              >
                <span>{number}</span>{label}
              </button>
            );
          })}
        </div>

        {step === 1 && (
          <section className="workspace-card">
            <div className="workspace-card-head">
              <div>
                <div className="kicker">Step 1 · Research</div>
                <h2>Paste the research, report or rough notes.</h2>
              </div>
              <span className="quiet-badge">Nothing is published automatically</span>
            </div>
            <textarea
              className="research-input"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="Paste your report, generated research, interview notes, statistics, source material or rough argument here..."
            />
            <div className="workspace-actions">
              <span>{raw.trim() ? `${raw.trim().split(/\s+/).length.toLocaleString()} words` : "Waiting for material"}</span>
              <button className="primary-button" onClick={createDraft} disabled={!raw.trim()}>Create article draft →</button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="workspace-card">
            <div className="workspace-card-head">
              <div>
                <div className="kicker">Step 2 · Article</div>
                <h2>Edit the reader-facing draft.</h2>
              </div>
              <span className="quiet-badge">Local editorial pass</span>
            </div>
            <textarea
              className="article-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Your article draft will appear here."
            />
            <div className="editor-note">
              This first pass removes obvious structural clutter and a small set of generic AI-style phrases. It does not invent facts or make unsupported claims more certain.
            </div>
            <div className="workspace-actions">
              <button className="secondary-button" onClick={() => setStep(1)}>← Back to research</button>
              <button className="primary-button" onClick={() => setStep(3)} disabled={!draft.trim()}>Review evidence →</button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="workspace-card">
            <div className="workspace-card-head">
              <div>
                <div className="kicker">Step 3 · Review</div>
                <h2>Check claims before you publish.</h2>
              </div>
              <span className="quiet-badge">You remain the final editor</span>
            </div>

            <div className="review-grid">
              <div className="review-block">
                <h3>Potential evidence checks</h3>
                {evidenceFlags.length ? (
                  <ul>
                    {evidenceFlags.map((flag) => <li key={flag}>{flag}</li>)}
                  </ul>
                ) : (
                  <p>No obvious numeric claims detected in this draft.</p>
                )}
                <small>These are prompts to verify, not automatic judgments that a claim is wrong.</small>
              </div>
              <div className="review-block">
                <h3>Optional personal layer</h3>
                <p>Before publishing, ask whether a field observation, interview, local comparison or direct experience would make the argument more specific.</p>
                <small>Skipping this never blocks the article.</small>
              </div>
            </div>

            <div className="workspace-actions">
              <button className="secondary-button" onClick={() => setStep(2)}>← Edit article</button>
              <button className="primary-button" onClick={() => setStep(4)}>Preview & distribute →</button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="workspace-card">
            <div className="workspace-card-head">
              <div>
                <div className="kicker">Step 4 · Publish</div>
                <h2>Prepare the same argument for each channel.</h2>
              </div>
              <span className="quiet-badge">Manual final publish in V1</span>
            </div>

            <div className="distribution-grid">
              <div><strong>Website</strong><span>Canonical long-form article</span></div>
              <div><strong>LinkedIn</strong><span>Sharper professional version</span></div>
              <div><strong>Medium</strong><span>Portable long-form copy</span></div>
              <div><strong>Substack</strong><span>Newsletter-ready edition</span></div>
              <div><strong>YouTube</strong><span>Script built from the same argument</span></div>
            </div>

            <div className="article-preview">
              <div className="kicker">Preview</div>
              <div className="preview-copy">{draft || "Your finished article will appear here."}</div>
            </div>

            <div className="workspace-actions">
              <button className="secondary-button" onClick={() => setStep(3)}>← Back to review</button>
              <span className="publish-note">V1 prepares the content. Nothing posts without your final action.</span>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
