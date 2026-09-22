import {notFound} from "next/navigation";
import ReaderControls from "../../../components/ReaderControls";
import EditorialPaperDocument from "../../../components/EditorialPaperDocument";
import {publicationBySlug} from "../../../lib/publications";
import {pricingPaperHtml} from "../../../lib/pricingPaperSource";

export const dynamic="force-dynamic";
export const metadata={
 title:"Pricing a promise | Jamal Nasir",
 description:"A technical study of a prefunded electricity price guarantee for Pakistani bulk power consumers, backtested on ISMO hourly data for calendar 2025."
};

export default async function Page(){
 const p=await publicationBySlug("price-of-a-promise");
 if(!p)notFound();
 const html=pricingPaperHtml();
 return <main className="paperPage">
  <style>{".paperPage{min-height:100vh;background:var(--reader-bg,#FFF1E5);color:var(--reader-text,#1A1A18)}@media print{.paperPage{background:#fff}}"}</style>
  <ReaderControls articleKey="price-of-a-promise" articleTitle={p.title}/>
  <EditorialPaperDocument html={html}/>
 </main>;
}
