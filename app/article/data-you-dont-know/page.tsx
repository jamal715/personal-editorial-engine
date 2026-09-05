import ReaderControls from "../../../components/ReaderControls";
import InteractiveCountryChart from "../../../components/InteractiveCountryChart";

export default function ArticlePage() {
  return (
    <main>
      <div className="shell">
        <header className="topbar">
          <div className="brand"><strong>Jamal Nasir</strong><span>Research & Analysis</span></div>
          <nav className="nav"><a href="/">Home</a><a href="/editor">Editor</a></nav>
        </header>
      </div>

      <article className="article-shell">
        <div className="kicker">Data & institutions</div>
        <h1 className="article-title">Data: you don’t know what you’ve got till it’s gone</h1>
        <p className="article-standfirst">The value of trustworthy official statistics is difficult to price. One way to understand it is to look at what happens when confidence in them weakens.</p>
        <div className="article-meta"><span>By Jamal Nasir</span><span>8 min read</span><span>Analysis</span></div>

        <div className="article-body">
          <p>Official statistics are easy to treat as background infrastructure. They arrive on schedule, are quoted in policy papers and news reports, and disappear into spreadsheets used by businesses, governments and researchers. Their usefulness is usually assumed rather than measured.</p>
          <p>That creates an odd problem. The institutions producing the numbers can tell us what inflation is, where populations are moving and how labour markets are changing, yet putting a clean price on the value of those measurements is much harder.</p>
          <p className="pullquote">The better question may not be what statistics are worth when they work, but what uncertainty costs when people stop trusting them.</p>
          <p>This article page is deliberately a working specimen rather than a finished publication piece. It establishes the reading experience we want: restrained typography, clear argument, editable sourcing, and room for data that a reader can interrogate rather than merely look at.</p>

          <InteractiveCountryChart />

          <h2>Numbers should be part of the argument</h2>
          <p>An interactive chart is useful only when it helps answer the question the article is asking. The publication should not become a dashboard with prose wrapped around it. The argument remains primary; the visual exists because the reader can learn something by changing the comparison.</p>
          <p>That principle will guide every future chart, map and table in the system. The editor will be able to change titles, labels, source notes and explanatory captions before publication. Readers will be able to change the variables we intentionally expose without altering the underlying editorial framing.</p>

          <h2>Uncertainty belongs in the prose</h2>
          <p>A serious article should be comfortable saying that an estimate is weak, that two sources disagree, or that the evidence does not support a confident conclusion. The editorial engine will therefore flag uncertainty privately instead of smoothing it away.</p>
          <p>The objective is not to make research sound more certain. It is to make the limits of the evidence easier to understand.</p>
        </div>
      </article>

      <ReaderControls />
    </main>
  );
}
