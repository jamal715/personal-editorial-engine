"use client";

import { useEffect, useMemo, useState } from "react";

type Chapter={code:string;sheet:string;name:string};
type Exporter={rank:number;name:string;ntn:string;value:number;share:number;cumulative:number;hs8Count:number;hs4Count:number;largestHs8:string};
type Product={rank:number;hs8:string;name:string;value:number;exporters:number;share:number};
type Strategic={tier:"A"|"B";exporter:string;hs8:string;product:string;chapterRank:number;hs8Rank:number;firmsInHs8:number;shareWithinHs8:number;firmValue:number;hs8Value:number};
type Data={
 chapter:{code:string;name:string};
 kpis:{totalValue:number;exporters:number;products:number;top1:number;top5:number;top10:number;hhi:number;to60:number;to80:number};
 exporters:Exporter[]; products:Product[]; concentration:{rank:number;cumulative:number}[]; strategic:Strategic[];
 tierCounts:{A:number;B:number;C:number}; insights:string[]; guardrail:string;
};

const money=(n:number)=>n>=1e9?`Rs ${(n/1e9).toFixed(1)}bn`:n>=1e6?`Rs ${(n/1e6).toFixed(1)}m`:`Rs ${n.toLocaleString()}`;
const pct=(n:number)=>`${(n*100).toFixed(1)}%`;

function ConcentrationCurve({points}:{points:{rank:number;cumulative:number}[]}){
 const shown=points.slice(0,Math.min(points.length,80));
 const maxRank=Math.max(1,shown.at(-1)?.rank||1);
 const path=shown.map((p,i)=>`${i?"L":"M"} ${(p.rank/maxRank)*1000} ${300-(p.cumulative*280)}`).join(" ");
 return <div className="ie-chartbox"><svg viewBox="0 0 1000 330" role="img" aria-label="Cumulative exporter concentration curve">
   {[.25,.5,.6,.8,1].map(v=><g key={v}><line x1="0" x2="1000" y1={300-v*280} y2={300-v*280} stroke="#d8d4cd"/><text x="8" y={294-v*280} fontSize="18" fill="#6d7375">{Math.round(v*100)}%</text></g>)}
   <path d={path} fill="none" stroke="#004d73" strokeWidth="8" strokeLinecap="round"/>
 </svg></div>;
}

export default function FoodExportExplorer(){
 const [chapters,setChapters]=useState<Chapter[]>([]);
 const [chapter,setChapter]=useState("12");
 const [data,setData]=useState<Data|null>(null);
 const [loading,setLoading]=useState(true);
 const [topN,setTopN]=useState(10);

 useEffect(()=>{ let cancelled=false; setLoading(true); fetch(`/api/export-intelligence?chapter=${chapter}`).then(r=>r.json()).then(j=>{if(cancelled)return;setChapters(j.chapters||[]);setData(j.data||null);setLoading(false)}).catch(()=>setLoading(false));return()=>{cancelled=true}},[chapter]);
 const exporterMax=Math.max(1,...(data?.exporters.slice(0,topN).map(x=>x.value)||[1]));
 const productMax=Math.max(1,...(data?.products.slice(0,10).map(x=>x.value)||[1]));
 const tierTotal=(data?.tierCounts.A||0)+(data?.tierCounts.B||0)+(data?.tierCounts.C||0);
 const strategicTop=useMemo(()=>data?.strategic.slice(0,12)||[],[data]);

 return <div className="ie-wrap">
   <style>{styles}</style>
   <section className="ie-controlbar">
     <div><span>LIVE ANALYTICAL SOURCE</span><strong>Pakistan Export Intelligence workbook</strong></div>
     <label>HS chapter<select value={chapter} onChange={e=>setChapter(e.target.value)}>{chapters.map(c=><option key={c.code} value={c.code}>HS {c.code} · {c.name}</option>)}</select></label>
   </section>

   {loading && <div className="ie-loading">Loading the selected chapter from the same master workbook used by the analytical app…</div>}
   {!loading && !data && <div className="ie-loading">The analytical workbook could not be loaded.</div>}
   {data && <>
     <section className="ie-titleline"><div><span>HS {data.chapter.code}</span><h2>{data.chapter.name}</h2></div><p>{data.guardrail}</p></section>

     <section className="ie-kpis">
       <div><span>TDAP reported value</span><b>{money(data.kpis.totalValue)}</b></div>
       <div><span>Observed exporters</span><b>{data.kpis.exporters.toLocaleString()}</b></div>
       <div><span>Distinct HS8 products</span><b>{data.kpis.products}</b></div>
       <div><span>Top 10 share</span><b>{pct(data.kpis.top10)}</b></div>
       <div><span>Exporters to 60%</span><b>{data.kpis.to60}</b></div>
       <div><span>HHI</span><b>{data.kpis.hhi.toFixed(0)}</b></div>
     </section>

     <section className="ie-insights"><span className="ie-eyebrow">What matters in this chapter</span><div>{data.insights.map((x,i)=><p key={i}>{x}</p>)}</div></section>

     <section className="ie-grid two">
       <article className="ie-panel">
         <header><div><span className="ie-eyebrow">01 · Concentration</span><h3>How quickly does reported value concentrate?</h3></div><div className="ie-mini"><b>{pct(data.kpis.top5)}</b><span>top five</span></div></header>
         <ConcentrationCurve points={data.concentration}/>
         <div className="ie-thresholds"><span><b>{data.kpis.to60}</b> firms → 60%</span><span><b>{data.kpis.to80}</b> firms → 80%</span><span><b>{pct(data.kpis.top1)}</b> top firm</span></div>
       </article>

       <article className="ie-panel">
         <header><div><span className="ie-eyebrow">02 · Exporter structure</span><h3>Who controls the top of the extract?</h3></div><select value={topN} onChange={e=>setTopN(Number(e.target.value))}><option value="10">Top 10</option><option value="15">Top 15</option><option value="25">Top 25</option></select></header>
         <div className="ie-bars">{data.exporters.slice(0,topN).map(e=><div className="ie-bar" key={`${e.rank}-${e.name}`}><span className="rank">{e.rank}</span><div className="label"><b>{e.name}</b><small>{e.largestHs8} · {e.hs8Count} HS8</small></div><div className="track"><i style={{width:`${(e.value/exporterMax)*100}%`}}/></div><strong>{pct(e.share)}</strong></div>)}</div>
       </article>
     </section>

     <section className="ie-grid two">
       <article className="ie-panel">
         <header><div><span className="ie-eyebrow">03 · Product mix</span><h3>Which HS8 products dominate?</h3></div></header>
         <div className="ie-products">{data.products.slice(0,10).map(p=><div key={`${p.hs8}-${p.name}`}><div className="prodhead"><span>{p.hs8}</span><b>{pct(p.share)}</b></div><strong>{p.name}</strong><small>{p.exporters} observed exporters</small><div className="prodtrack"><i style={{width:`${(p.value/productMax)*100}%`}}/></div></div>)}</div>
       </article>

       <article className="ie-panel">
         <header><div><span className="ie-eyebrow">04 · Strategic selection</span><h3>How much of the pipeline clears the app’s evidence rules?</h3></div></header>
         <div className="tier-stack"><div className="tier a" style={{width:`${tierTotal?data.tierCounts.A/tierTotal*100:0}%`}}/><div className="tier b" style={{width:`${tierTotal?data.tierCounts.B/tierTotal*100:0}%`}}/><div className="tier c" style={{width:`${tierTotal?data.tierCounts.C/tierTotal*100:0}%`}}/></div>
         <div className="tier-legend"><div><b>{data.tierCounts.A}</b><span>Tier A<br/>high-priority evidence</span></div><div><b>{data.tierCounts.B}</b><span>Tier B<br/>priority review</span></div><div><b>{data.tierCounts.C}</b><span>Tier C<br/>broader pipeline</span></div></div>
         <p className="ie-note">The same transparent rules as the analytical app are used: firm scale, within-HS8 rank, observed HS8 share and scarcity. This is a due-diligence screen, not a financing recommendation.</p>
       </article>
     </section>

     <section className="ie-panel ie-shortlist">
       <header><div><span className="ie-eyebrow">05 · Priority evidence</span><h3>Exporter × product combinations worth investigating first</h3></div></header>
       <div className="ie-table"><div className="ie-tr head"><span>Tier</span><span>Exporter</span><span>HS8 / product</span><span>Chapter rank</span><span>HS8 position</span><span>Observed HS8 share</span></div>{strategicTop.map((s,i)=><div className="ie-tr" key={`${s.exporter}-${s.hs8}-${i}`}><span><em className={`pill ${s.tier.toLowerCase()}`}>{s.tier}</em></span><span><b>{s.exporter}</b></span><span>{s.hs8}<small>{s.product}</small></span><span>#{s.chapterRank}</span><span>#{s.hs8Rank} of {s.firmsInHs8}</span><span>{pct(s.shareWithinHs8)}</span></div>)}</div>
     </section>

     <div className="ie-source">Source engine: the same <b>TDAP_Export_Directory_HS01_24.xlsx</b> master workbook and analytical definitions used by the Pakistan Export Intelligence app. Changing the chapter above recalculates the page from that workbook.</div>
   </>}
 </div>
}

const styles=`
.ie-wrap{margin:58px 0 78px;font-family:Arial,Helvetica,sans-serif;color:#343a3d}.ie-controlbar{display:flex;justify-content:space-between;gap:24px;align-items:end;border-top:4px solid #202426;border-bottom:1px solid #cfc9bf;padding:18px 0}.ie-controlbar>div span,.ie-eyebrow{display:block;color:#004d73;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}.ie-controlbar>div strong{display:block;margin-top:7px;color:#202426;font-size:18px}.ie-controlbar label{display:grid;gap:6px;font-size:11px;color:#6d7375}.ie-controlbar select,.ie-panel select{min-width:280px;border:1px solid #bbb6ae;background:#fbf8f3;padding:10px 12px;color:#202426}.ie-loading{padding:50px 0;color:#6d7375}.ie-titleline{display:flex;justify-content:space-between;gap:40px;align-items:end;padding:34px 0 18px}.ie-titleline span{font-size:12px;font-weight:800;color:#004d73}.ie-titleline h2{margin:7px 0 0;font:700 42px/1.04 Georgia,'Times New Roman',serif;color:#202426}.ie-titleline p{max-width:500px;margin:0;font-size:11px;line-height:1.55;color:#6d7375}.ie-kpis{display:grid;grid-template-columns:repeat(6,1fr);border-top:1px solid #202426;border-bottom:1px solid #202426}.ie-kpis div{padding:17px 13px;border-right:1px solid #d8d4cd}.ie-kpis div:last-child{border-right:0}.ie-kpis span{display:block;min-height:28px;color:#6d7375;font-size:10px;line-height:1.3;text-transform:uppercase;letter-spacing:.05em}.ie-kpis b{display:block;margin-top:9px;color:#202426;font:700 26px/1 Georgia,'Times New Roman',serif}.ie-insights{display:grid;grid-template-columns:220px 1fr;gap:32px;padding:30px 0 38px}.ie-insights div{display:grid;grid-template-columns:1fr 1fr;gap:8px 28px}.ie-insights p{margin:0;padding:0 0 12px;border-bottom:1px solid #ded8cf;font:17px/1.45 Georgia,'Times New Roman',serif;color:#404648}.ie-grid.two{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:22px}.ie-panel{background:#fbf8f3;border:1px solid #d8d4cd;padding:22px}.ie-panel header{display:flex;justify-content:space-between;gap:18px;align-items:start;margin-bottom:22px}.ie-panel h3{margin:7px 0 0;font:700 27px/1.08 Georgia,'Times New Roman',serif;color:#202426}.ie-mini{text-align:right}.ie-mini b{display:block;font:700 28px/1 Georgia,'Times New Roman',serif;color:#004d73}.ie-mini span{font-size:10px;color:#6d7375}.ie-chartbox{height:280px;overflow:hidden}.ie-chartbox svg{width:100%;height:100%}.ie-thresholds{display:flex;gap:18px;flex-wrap:wrap;border-top:1px solid #ded8cf;padding-top:13px;font-size:11px;color:#6d7375}.ie-thresholds b{color:#202426}.ie-bars{display:grid;gap:9px;max-height:430px;overflow:auto;padding-right:4px}.ie-bar{display:grid;grid-template-columns:24px minmax(150px,1.2fr) minmax(120px,1fr) 58px;gap:10px;align-items:center}.ie-bar .rank{font-size:10px;color:#8a8f91}.ie-bar .label b{display:block;font-size:12px;color:#202426}.ie-bar .label small{display:block;margin-top:2px;font-size:9px;color:#7a8082}.track,.prodtrack{background:#e6e0d7;height:10px}.track i,.prodtrack i{display:block;height:100%;background:#004d73}.ie-bar>strong{text-align:right;font-size:11px}.ie-products{display:grid;gap:12px}.ie-products>div{border-bottom:1px solid #ded8cf;padding-bottom:10px}.prodhead{display:flex;justify-content:space-between;font-size:10px;color:#004d73}.ie-products>div>strong{display:block;margin:4px 0 2px;color:#202426;font-size:12px}.ie-products small{font-size:9px;color:#767c7e}.prodtrack{margin-top:8px;height:7px}.tier-stack{height:42px;display:flex;background:#e7e1d8;margin:36px 0 22px}.tier{height:100%}.tier.a{background:#004d73}.tier.b{background:#6f95a8}.tier.c{background:#c7c1b8}.tier-legend{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.tier-legend div{border-top:2px solid #202426;padding-top:10px}.tier-legend b{display:block;font:700 31px/1 Georgia,'Times New Roman',serif;color:#202426}.tier-legend span{display:block;margin-top:6px;font-size:10px;line-height:1.35;color:#6d7375}.ie-note{margin:22px 0 0;font-size:11px;line-height:1.55;color:#6d7375}.ie-shortlist{margin-top:22px}.ie-table{overflow:auto}.ie-tr{display:grid;grid-template-columns:55px minmax(180px,1.2fr) minmax(190px,1.5fr) 90px 100px 120px;gap:12px;align-items:center;border-top:1px solid #ded8cf;padding:10px 4px;font-size:11px;min-width:850px}.ie-tr.head{font-size:9px;text-transform:uppercase;color:#7a8082;letter-spacing:.04em}.ie-tr span small{display:block;color:#7a8082;margin-top:3px}.pill{font-style:normal;font-weight:800;border-radius:999px;padding:5px 8px}.pill.a{background:#004d73;color:white}.pill.b{background:#d7e7ef;color:#004d73}.ie-source{margin-top:18px;padding:13px 0;border-top:1px solid #202426;font-size:10px;line-height:1.5;color:#6d7375}@media(max-width:950px){.ie-kpis{grid-template-columns:repeat(3,1fr)}.ie-grid.two{grid-template-columns:1fr}.ie-insights{grid-template-columns:1fr}.ie-controlbar,.ie-titleline{align-items:start;flex-direction:column}.ie-controlbar select{min-width:0;width:100%}.ie-controlbar label{width:100%}}@media(max-width:620px){.ie-kpis{grid-template-columns:repeat(2,1fr)}.ie-insights div{grid-template-columns:1fr}.ie-titleline h2{font-size:34px}.ie-bar{grid-template-columns:22px 1fr 48px}.ie-bar .track{grid-column:2/4}.tier-legend{grid-template-columns:1fr 1fr 1fr}.ie-panel{padding:17px}}
`;
