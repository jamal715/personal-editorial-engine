import FoodExportExplorer from "../../../components/FoodExportExplorer";
import ReaderControls from "../../../components/ReaderControls";

export const metadata = {
  title: "Pakistan's non-rice food exports are not one market",
  description: "An interactive research note on the products, firms and commercial pathways behind Pakistan's non-rice food exports."
};

const pageStyles = `
.research-note{background:#f7f1e8;min-height:100vh}.note-shell{max-width:1180px;margin:0 auto;padding:58px 28px 120px}.note-hero{max-width:940px}.note-hero h1{margin:14px 0 22px;font:700 clamp(54px,7vw,92px)/.95 Georgia,'Times New Roman',serif;letter-spacing:-.055em;color:#202426}.note-prose{max-width:760px;margin:42px auto 0;font:20px/1.72 Georgia,'Times New Roman',serif;color:#343a3d}.note-prose p{margin:0 0 1.5em}.note-prose h2{margin:2.2em 0 .7em;font-size:34px;color:#202426}.food-explorer{margin:72px 0}.viz-panel{border-top:1px solid #202426;padding:28px 0 54px}.viz-head{display:flex;justify-content:space-between;gap:28px;align-items:flex-end;margin-bottom:24px}.viz-kicker{display:block;color:#004d73;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px}.viz-head h3,.spotlight-copy h3{margin:0;font:700 34px/1.05 Georgia,'Times New Roman',serif;color:#202426}.segmented{display:inline-flex;border:1px solid #c8c3bb;background:#fbf8f3}.segmented button{border:0;background:transparent;padding:9px 12px;color:#646a6c}.segmented button.active{background:#004d73;color:white}.chapter-layout{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(260px,.7fr);gap:34px}.chapter-list{display:grid;gap:3px}.chapter-row{display:grid;grid-template-columns:44px minmax(170px,1fr) 100px 160px;gap:12px;align-items:center;border:0;border-bottom:1px solid #ded8cf;background:transparent;padding:11px 8px;text-align:left}.chapter-row:hover,.chapter-row.active{background:#fbf8f3}.chapter-row.active{box-shadow:inset 3px 0 0 #004d73}.chapter-code{font-weight:700;color:#004d73}.chapter-name{color:#202426}.chapter-value{text-align:right;font-variant-numeric:tabular-nums}.chapter-track{height:7px;background:#e5dfd6;display:block}.chapter-track span{display:block;height:100%;background:#004d73}.chapter-focus{border-left:1px solid #d8d4cd;padding-left:28px}.focus-number{font-size:12px;color:#004d73;font-weight:700;letter-spacing:.12em}.chapter-focus h4{margin:10px 0 18px;font:700 28px/1.1 Georgia,'Times New Roman',serif;color:#202426}.focus-value{font:700 42px/1 Georgia,'Times New Roman',serif;color:#202426}.delta{display:inline-block;margin:12px 0 20px;padding:5px 8px;font-size:12px;background:#eee9e0}.delta.positive{color:#356a4b}.delta.negative{color:#9f3b3b}.focus-stats{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0 16px}.focus-stats div{border-top:2px solid #202426;padding-top:8px}.focus-stats b{display:block;font-size:24px;color:#202426}.focus-stats span{font-size:11px;color:#6d7375}.chapter-focus p,.viz-footnote{font-size:12px;line-height:1.55;color:#6d7375}.sesame-panel{display:grid;grid-template-columns:.8fr 1.2fr;gap:48px}.spotlight-copy p{font-size:15px;line-height:1.65;color:#555d60}.layer-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;align-items:center;gap:10px}.flow-node{min-height:150px;border:1px solid #d8d4cd;background:#fbf8f3;padding:18px;display:flex;flex-direction:column}.flow-node span{color:#004d73;font-size:11px;font-weight:700}.flow-node b{margin-top:auto;color:#202426}.flow-node small{margin-top:6px;color:#6d7375;line-height:1.35}.flow-node.strong{background:#202426}.flow-node.strong b,.flow-node.strong small{color:white}.flow-node.strong span{color:#9cc3d5}.flow-arrow{font-size:23px;color:#004d73}.firm-bars{display:grid;gap:10px}.firm-row{display:grid;grid-template-columns:34px minmax(220px,1.2fr) minmax(180px,1fr) 90px;gap:14px;align-items:center}.firm-rank{font-size:11px;color:#6d7375}.firm-row b{display:block;color:#202426;font-size:14px}.firm-row small{display:block;color:#6d7375;font-size:11px;margin-top:3px}.firm-track{height:12px;background:#e7e1d8}.firm-track span{display:block;height:100%;background:#004d73}.firm-row>strong{text-align:right;font-size:13px;font-variant-numeric:tabular-nums}.product-cloud{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.product-cloud div{min-height:140px;border:1px solid #d8d4cd;background:#fbf8f3;padding:18px;display:flex;flex-direction:column;justify-content:flex-end}.product-cloud b{font:700 44px/1 Georgia,'Times New Roman',serif;color:#004d73}.product-cloud span{margin-top:8px;color:#202426}.viz-footnote{margin-top:20px;max-width:820px}.use-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:14px}.use-grid>div{border-top:4px solid #202426;padding-top:14px}.use-grid span{color:#004d73;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em}.use-grid h4{margin:12px 0 8px;font:700 23px/1.15 Georgia,'Times New Roman',serif;color:#202426}.use-grid p{font-size:13px;line-height:1.55;color:#62686a}.method-box{margin-top:48px;border:1px solid #cfc9bf;background:#fbf8f3;padding:22px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6}.method-box p{margin:8px 0 0}.after-viz{margin-top:64px}@media(max-width:900px){.chapter-layout,.sesame-panel{grid-template-columns:1fr}.chapter-focus{border-left:0;border-top:1px solid #d8d4cd;padding:24px 0 0}.layer-flow{grid-template-columns:1fr}.flow-arrow{transform:rotate(90deg);text-align:center}.use-grid{grid-template-columns:1fr 1fr}.firm-row{grid-template-columns:28px 1fr 80px}.firm-track{grid-column:2/4}.chapter-row{grid-template-columns:38px 1fr 90px}.chapter-track{grid-column:2/4}.viz-head{align-items:flex-start;flex-direction:column}.product-cloud{grid-template-columns:1fr}}@media(max-width:620px){.note-shell{padding:40px 20px 100px}.note-hero h1{font-size:48px}.use-grid{grid-template-columns:1fr}.chapter-row{grid-template-columns:34px 1fr}.chapter-value{grid-column:2;text-align:left}.chapter-track{grid-column:2}.firm-row{grid-template-columns:24px 1fr}.firm-row>strong{grid-column:2;text-align:left}.firm-track{grid-column:2}.segmented{width:100%}.segmented button{flex:1}}
`;

export default function FoodExportNote(){
  return <main className="research-note">
    <style>{pageStyles}</style>
    <div className="shell">
      <header className="topbar note-topbar">
        <a className="brand" href="/"><strong>Jamal Nasir</strong></a>
        <nav className="nav"><a href="/">Home</a><a href="/editor">Editor</a></nav>
      </header>
    </div>

    <article className="note-shell">
      <header className="note-hero">
        <div className="kicker">Interactive research note · Pakistan trade</div>
        <h1>Pakistan’s non-rice food exports are not one market.</h1>
        <p className="article-standfirst">The useful question is not only how much Pakistan exports. It is which products, firms and commercial pathways can convert existing capability into repeatable foreign-exchange earnings.</p>
        <div className="article-meta"><span>Research note</span><span>Interactive data</span><span>Built from PBS and TDAP evidence layers</span></div>
      </header>

      <div className="note-prose">
        <p>Pakistan’s food-export headline is large enough to attract attention, but the headline is also a poor guide to strategy. In FY2025-26, food-group exports were about $5.02bn. Rice alone accounted for roughly $2.29bn, leaving about $2.73bn across the rest of the basket. That remainder is not a single market. It is a collection of product systems with different firms, standards, preservation needs, logistics and buyers.</p>
        <p>The point of this exercise is to make that structure visible. A policymaker should be able to move from a chapter to the products inside it. A banker should be able to identify firms worth investigating. A researcher should be able to see where the evidence ends and where another layer is still needed. The visuals below are built to support that movement rather than merely decorate the article.</p>
      </div>

      <FoodExportExplorer />

      <div className="note-prose after-viz">
        <h2>What this changes</h2>
        <p>Aggregate trade statistics are necessary, but they are not enough to identify a scalable export pathway. A large national number does not tell us whether the activity is concentrated in a handful of firms, distributed across many small exporters, dependent on one product form, or exposed to a narrow set of markets.</p>
        <p>That is why the national PBS trade layer and the TDAP exporter layer are deliberately kept separate here. The first tells us the size and geography of trade. The second helps identify firms and HS8 capabilities for further investigation. Until a defensible linkage is established, national export value should not be allocated to individual exporters.</p>

        <h2>How this can be used</h2>
        <p>For policy, the tool can help distinguish sectors that need buyer access from sectors that first need aggregation, processing, cold-chain, standards or logistics. For finance, it creates a transparent first screen for exporter engagement before credit analysis. For researchers, it creates a reproducible structure for moving from the macro headline to product and firm-level questions.</p>
        <p>This first note is only the beginning. The next version should connect the same structure to richer destination analysis, global demand, competitor concentration, tariffs and verified strategic partners — while keeping every inference visible to the reader.</p>

        <div className="method-box">
          <b>Method note</b>
          <p>National trade values use Pakistan Bureau of Statistics HS8 × destination data for FY2024 and FY2025. Firm discovery uses TDAP exporter-directory records. Reported record count is not physical quantity; TDAP extract shares are not Pakistan national market shares; firm attribution and national aggregates remain separate unless a defensible linkage exists.</p>
        </div>
      </div>
    </article>

    <ReaderControls />
  </main>
}
