import { readFileSync } from "fs";
import { join } from "path";
import ReaderControls from "../../../components/ReaderControls";
import PriceGuaranteeExplorer from "../../../components/PriceGuaranteeExplorer";

export const metadata={
  title:"The price of a promise | Jamal Nasir",
  description:"A technical study of a prefunded electricity price guarantee for Pakistani bulk power consumers, backtested on ISMO hourly data and accompanied by a live simulation."
};

export const dynamic="force-static";

export default function Page(){
  const source=readFileSync(join(process.cwd(),"content/articles/price-of-a-promise.html"),"utf8");
  const css=readFileSync(join(process.cwd(),"content/articles/price-of-a-promise.css"),"utf8");
  const [beforeModel,afterModel]=source.split("<!-- LIVE_SIMULATION -->");
  return <main className="promise">
    <style>{css}</style>
    <ReaderControls articleKey="price-of-a-promise" articleTitle="The price of a promise" widths={[820,940,1020]}/>
    <header className="siteHeader">
      <a className="siteName" href="/">Jamal Nasir</a>
      <nav aria-label="Research navigation"><a href="/">Research</a></nav>
    </header>
    <div className="paperContent" dangerouslySetInnerHTML={{__html:beforeModel}}/>
    <section className="simulationShell" aria-label="Live price guarantee simulation"><PriceGuaranteeExplorer/></section>
    <div className="paperContent" dangerouslySetInnerHTML={{__html:afterModel}}/>
  </main>
}
