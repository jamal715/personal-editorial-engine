export default function HomePage() {
  return (
    <main className="public-home">
      <div className="shell">
        <header className="topbar home-topbar">
          <a className="brand" href="/"><strong>Jamal Nasir</strong></a>
          <nav className="nav"><a href="/editor">Editor</a></nav>
        </header>

        <section className="identity-hero compact-identity">
          <h1>Enthusiastic to build and create.</h1>
          <p className="identity-line">Quantifying economic signals for a sustainable future.</p>
          <p className="identity-copy">I work across research, data, finance and systems — turning complex evidence into useful analysis, tools and ideas that can be tested, improved and put to work.</p>
        </section>

        <section className="notes-section">
          <div className="notes-label">Latest research note</div>
          <a className="note-card" href="/article/pakistan-food-export-intelligence">
            <div className="note-card-copy">
              <span className="kicker">Pakistan trade · Interactive</span>
              <h2>Pakistan’s non-rice food exports are not one market.</h2>
              <p>An interactive view of the products, firms and commercial pathways behind the headline export number — designed for researchers, policymakers, financiers and businesses.</p>
            </div>
            <div className="note-card-signal">
              <span>Explore</span>
              <b>13</b><small>non-rice HS chapters</small>
              <b>2</b><small>evidence layers</small>
              <b>1</b><small>live firm deep-dive</small>
            </div>
          </a>
        </section>
      </div>
    </main>
  );
}
