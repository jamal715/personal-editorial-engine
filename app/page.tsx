const homeStyles = `
.compact-identity{min-height:auto;padding:86px 0 72px;border-bottom:1px solid #d8d4cd}.compact-identity h1{max-width:860px;font-size:clamp(58px,7vw,94px)}.notes-section{padding:44px 0 100px}.notes-label{margin-bottom:14px;color:#6d7375;font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase}.note-card{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(240px,.55fr);gap:42px;border-top:4px solid #202426;border-bottom:1px solid #d8d4cd;padding:28px 0 34px}.note-card-copy h2{margin:12px 0 14px;max-width:790px;font:700 clamp(38px,5vw,64px)/1.02 Georgia,'Times New Roman',serif;letter-spacing:-.04em;color:#202426}.note-card-copy p{max-width:720px;font:19px/1.55 Georgia,'Times New Roman',serif;color:#555d60}.note-card-signal{border-left:1px solid #d8d4cd;padding-left:28px;display:grid;grid-template-columns:58px 1fr;align-content:start;gap:8px 14px}.note-card-signal>span{grid-column:1/3;color:#004d73;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;margin-bottom:10px}.note-card-signal b{font:700 36px/1 Georgia,'Times New Roman',serif;color:#202426}.note-card-signal small{align-self:end;padding-bottom:4px;color:#6d7375;line-height:1.3}.note-card:hover h2{color:#004d73}@media(max-width:760px){.note-card{grid-template-columns:1fr}.note-card-signal{border-left:0;border-top:1px solid #d8d4cd;padding:22px 0 0}.compact-identity{padding-top:58px}}
`;

export default function HomePage() {
  return (
    <main className="public-home">
      <style>{homeStyles}</style>
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
