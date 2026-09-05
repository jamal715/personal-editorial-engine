import FoodExportExplorer from "../../../components/FoodExportExplorer";
import ReaderControls from "../../../components/ReaderControls";

export const metadata = {
  title: "Pakistan's non-rice food exports are not one market",
  description: "An interactive research note on the products, firms and commercial pathways behind Pakistan's non-rice food exports."
};

export default function FoodExportNote(){
  return <main className="research-note">
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
