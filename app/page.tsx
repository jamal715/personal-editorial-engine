export default function HomePage() {
  return (
    <main className="public-home">
      <div className="shell">
        <header className="topbar home-topbar">
          <a className="brand" href="/">
            <strong>Jamal Nasir</strong>
          </a>
          <nav className="nav">
            <a href="/editor">Editor</a>
          </nav>
        </header>

        <section className="identity-hero">
          <div className="identity-kicker">Jamal Nasir</div>
          <h1>Enthusiastic to build and create.</h1>
          <p className="identity-line">Quantifying economic signals for a sustainable future.</p>
          <p className="identity-copy">
            I work across research, data, finance and systems — turning complex evidence into useful analysis, tools and ideas that can be tested, improved and put to work.
          </p>
          <div className="identity-actions">
            <a className="primary-link" href="/editor">Open editorial workspace</a>
          </div>
        </section>
      </div>
    </main>
  );
}
