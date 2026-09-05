export default function HomePage() {
  return (
    <main>
      <div className="shell">
        <header className="topbar">
          <div className="brand"><strong>Noshaba Nasir</strong><span>Research & Analysis</span></div>
          <nav className="nav"><a href="/">Latest</a><a href="/article/data-you-dont-know">Featured</a><a href="/editor">Editor</a></nav>
        </header>

        <section className="hero">
          <div className="kicker">Independent research, data and ideas</div>
          <h1>Clear arguments. Serious evidence. No slogans.</h1>
          <p className="deck">A topic-agnostic publication for research that is useful beyond the report it came from — written for readers, not committees.</p>
        </section>

        <section className="article-grid">
          <a className="feature-card" href="/article/data-you-dont-know">
            <div className="kicker">Data & institutions</div>
            <h2>Data: you don’t know what you’ve got till it’s gone</h2>
            <p>Reliable statistics can look like a bureaucratic expense. Their value becomes easier to see when trust in them starts to disappear.</p>
            <div className="meta">8 min read · Interactive chart</div>
          </a>
          <div>
            <div className="side-card">
              <div className="kicker">Coming next</div>
              <h3>Inside the battery race</h3>
              <p>What the rise of large-scale battery manufacturing says about industrial power, innovation and the energy transition.</p>
            </div>
            <div className="side-card" style={{marginTop: 38}}>
              <div className="kicker">Editorial principle</div>
              <h3>Numbers need interpretation</h3>
              <p>The publication does not stop at what a figure says. It asks what it means, how certain it is, and what would change the conclusion.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
