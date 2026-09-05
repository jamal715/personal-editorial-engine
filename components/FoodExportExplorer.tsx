"use client";

import { useMemo, useState } from "react";

type Chapter = { code:string; name:string; fy24:number; fy25:number; hs8_24:number; hs8_25:number; markets24:number; markets25:number };
type Exporter = { name:string; value:number; hs8:string; product:string };

const chapters: Chapter[] = [
  {code:"02",name:"Meat & edible offal",fy24:144.95,fy25:135.35,hs8_24:26,hs8_25:24,markets24:24,markets25:24},
  {code:"03",name:"Fish & seafood",fy24:114.44,fy25:128.44,hs8_24:69,hs8_25:55,markets24:36,markets25:39},
  {code:"07",name:"Vegetables",fy24:113.57,fy25:93.86,hs8_24:42,hs8_25:37,markets24:49,markets25:52},
  {code:"08",name:"Fruit & nuts",fy24:93.49,fy25:83.64,hs8_24:61,hs8_25:60,markets24:68,markets25:69},
  {code:"09",name:"Coffee, tea & spices",fy24:36.08,fy25:32.11,hs8_24:38,hs8_25:43,markets24:86,markets25:85},
  {code:"12",name:"Oil seeds, grains & medicinal plants",fy24:141.59,fy25:127.52,hs8_24:30,hs8_25:30,markets24:84,markets25:93},
  {code:"15",name:"Animal & vegetable fats",fy24:10.09,fy25:38.21,hs8_24:22,hs8_25:24,markets24:40,markets25:47},
  {code:"17",name:"Sugar & confectionery",fy24:62.82,fy25:162.80,hs8_24:12,hs8_25:12,markets24:108,markets25:109},
  {code:"19",name:"Cereal & bakery preparations",fy24:30.00,fy25:37.81,hs8_24:23,hs8_25:20,markets24:97,markets25:100},
  {code:"20",name:"Prepared vegetables & fruit",fy24:24.58,fy25:26.49,hs8_24:31,hs8_25:30,markets24:89,markets25:81},
  {code:"21",name:"Misc. edible preparations",fy24:31.38,fy25:36.27,hs8_24:22,hs8_25:20,markets24:79,markets25:81},
  {code:"22",name:"Beverages",fy24:127.23,fy25:96.96,hs8_24:10,hs8_25:11,markets24:78,markets25:73},
  {code:"23",name:"Food industry residues",fy24:20.12,fy25:15.11,hs8_24:15,hs8_25:11,markets24:25,markets25:26}
];

const exporters: Exporter[] = [
  {name:"Produce Import & Export Co",value:220.08,hs8:"12119000",product:"Medicinal / aromatic plants"},
  {name:"M/S Durvesh International",value:172.03,hs8:"12119000",product:"Medicinal / aromatic plants"},
  {name:"M/S International Impex",value:95.66,hs8:"12119000",product:"Medicinal / aromatic plants"},
  {name:"Tower Trading Company",value:85.55,hs8:"12079900",product:"Other oil seeds"},
  {name:"Pakistan Trading House",value:84.68,hs8:"12119000",product:"Medicinal / aromatic plants"},
  {name:"M/S Duaa Enterprises",value:68.26,hs8:"12119000",product:"Medicinal / aromatic plants"},
  {name:"Munawar Industrial Ent",value:60.98,hs8:"12119000",product:"Medicinal / aromatic plants"},
  {name:"Amanat Trading Company",value:55.33,hs8:"12119000",product:"Medicinal / aromatic plants"},
  {name:"Mohammad & Fahad Brothers",value:47.78,hs8:"12079900",product:"Other oil seeds"},
  {name:"M/S G.R Traders",value:40.98,hs8:"12119000",product:"Medicinal / aromatic plants"}
];

export default function FoodExportExplorer(){
  const [selected,setSelected] = useState("12");
  const [year,setYear] = useState<"fy24"|"fy25">("fy25");
  const [firmView,setFirmView] = useState<"value"|"product">("value");
  const chapter = chapters.find(c=>c.code===selected)!;
  const max = Math.max(...chapters.map(c=>c[year]));
  const growth = ((chapter.fy25/chapter.fy24)-1)*100;
  const selectedLabel = year==="fy25" ? "FY2025" : "FY2024";
  const firmMax = Math.max(...exporters.map(e=>e.value));
  const productGroups = useMemo(()=>{
    const counts:Record<string,number>={}; exporters.forEach(e=>counts[e.product]=(counts[e.product]||0)+1); return Object.entries(counts);
  },[]);

  return <div className="food-explorer">
    <section className="viz-panel national-panel">
      <div className="viz-head">
        <div><span className="viz-kicker">National export layer</span><h3>Move from the headline to the actual product system</h3></div>
        <div className="segmented" aria-label="Fiscal year"><button className={year==="fy24"?"active":""} onClick={()=>setYear("fy24")}>FY2024</button><button className={year==="fy25"?"active":""} onClick={()=>setYear("fy25")}>FY2025</button></div>
      </div>
      <div className="chapter-layout">
        <div className="chapter-list" role="list">
          {chapters.map(c=><button key={c.code} onClick={()=>setSelected(c.code)} className={selected===c.code?"chapter-row active":"chapter-row"}>
            <span className="chapter-code">{c.code}</span><span className="chapter-name">{c.name}</span><span className="chapter-value">Rs {c[year].toFixed(1)}bn</span>
            <span className="chapter-track"><span style={{width:`${Math.max(3,(c[year]/max)*100)}%`}} /></span>
          </button>)}
        </div>
        <div className="chapter-focus">
          <div className="focus-number">HS {chapter.code}</div>
          <h4>{chapter.name}</h4>
          <div className="focus-value">Rs {chapter[year].toFixed(1)}bn</div>
          <div className={growth>=0?"delta positive":"delta negative"}>{growth>=0?"+":""}{growth.toFixed(1)}% FY24→FY25</div>
          <div className="focus-stats"><div><b>{year==="fy25"?chapter.hs8_25:chapter.hs8_24}</b><span>HS8 products</span></div><div><b>{year==="fy25"?chapter.markets25:chapter.markets24}</b><span>destination markets</span></div></div>
          <p>{selectedLabel} national trade data. Product and destination totals come from the PBS HS8 × country layer.</p>
        </div>
      </div>
    </section>

    <section className="viz-panel sesame-panel">
      <div className="spotlight-copy"><span className="viz-kicker">Chapter 12 spotlight</span><h3>The exporter layer tells a different story</h3><p>National statistics tell us how much Pakistan exported. The TDAP directory tells us which firms and HS8 capabilities appear in the exporter universe. These are deliberately kept as two separate evidence layers — the national totals are not attributed to individual firms.</p></div>
      <div className="layer-flow" aria-label="Evidence architecture">
        <div className="flow-node"><span>01</span><b>PBS national trade</b><small>HS8 × destination × fiscal year</small></div><div className="flow-arrow">→</div>
        <div className="flow-node"><span>02</span><b>Product system</b><small>30 HS8 lines in Chapter 12</small></div><div className="flow-arrow">→</div>
        <div className="flow-node"><span>03</span><b>TDAP firm directory</b><small>Exporter × HS8 records</small></div><div className="flow-arrow">→</div>
        <div className="flow-node strong"><span>04</span><b>Strategic use</b><small>Who to investigate, finance or support</small></div>
      </div>
    </section>

    <section className="viz-panel exporter-panel">
      <div className="viz-head"><div><span className="viz-kicker">Firm intelligence</span><h3>Who appears at the top of the Chapter 12 directory?</h3></div><div className="segmented"><button className={firmView==="value"?"active":""} onClick={()=>setFirmView("value")}>Reported value</button><button className={firmView==="product"?"active":""} onClick={()=>setFirmView("product")}>Product mix</button></div></div>
      {firmView==="value" ? <div className="firm-bars">{exporters.map((e,i)=><div className="firm-row" key={e.name}><span className="firm-rank">{String(i+1).padStart(2,"0")}</span><div><b>{e.name}</b><small>{e.hs8} · {e.product}</small></div><div className="firm-track"><span style={{width:`${(e.value/firmMax)*100}%`}} /></div><strong>Rs {e.value.toFixed(1)}m</strong></div>)}</div> : <div className="product-cloud">{productGroups.map(([name,count])=><div key={name}><b>{count}</b><span>{name}</span></div>)}</div>}
      <p className="viz-footnote">TDAP reported values shown above describe the directory extract and are not national market shares. Firm names are shown for research discovery; due diligence is still required before treating any firm as a current market leader.</p>
    </section>

    <section className="use-grid">
      <div><span>Policy</span><h4>Where is capability broad, thin or concentrated?</h4><p>Use product breadth and market reach to distinguish a production story from a scalable export pathway.</p></div>
      <div><span>Finance</span><h4>Which firms merit the next conversation?</h4><p>Exporter scale and HS8 position can create a transparent first screen before credit, transaction and buyer due diligence.</p></div>
      <div><span>Research</span><h4>What should be investigated next?</h4><p>Move from chapter totals into products, destinations, firms, logistics, standards and the binding constraint.</p></div>
      <div><span>Business</span><h4>Where are the commercial gaps?</h4><p>Compare existing product capability with destination reach, then look for missing processing, preservation, certification or buyer links.</p></div>
    </section>
  </div>
}
