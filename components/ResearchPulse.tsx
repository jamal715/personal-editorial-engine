"use client";
import {useEffect,useState} from "react";

type PulseData={chapter:{code:string;name:string};kpis:{exporters:number;products:number;top10:number;to60:number}};

export default function ResearchPulse(){
  const[data,setData]=useState<PulseData|null>(null);
  useEffect(()=>{let dead=false;const load=()=>fetch('/api/export-intelligence?chapter=12').then(r=>r.json()).then(j=>{if(!dead&&j.data)setData(j.data)}).catch(()=>{});load();const id=setInterval(load,60000);return()=>{dead=true;clearInterval(id)}},[]);
  const items=data?[
    `HS ${data.chapter.code} ${data.chapter.name}`,
    `${data.kpis.exporters.toLocaleString()} observed exporters`,
    `${data.kpis.products} HS8 product lines`,
    `Top 10 firms: ${(data.kpis.top10*100).toFixed(1)}% of observed value`,
    `${data.kpis.to60} firms reach 60% of observed value`
  ]:["Pakistan Export Intelligence","Live chapter analysis","Exporter concentration","Product mix","Strategic selection"];
  return <a className="pulse" href="/article/pakistan-food-export-intelligence" aria-label="Open latest research"><span className="pulseTag">RESEARCH PULSE</span><div className="pulseWindow"><div className="pulseTrack">{[...items,...items].map((x,i)=><span key={i}>{x}<i>●</i></span>)}</div></div><span className="pulseOpen">OPEN</span><style>{`.pulse{height:34px;background:#202426;color:#f7f1e8;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:18px;padding:0 22px;font:700 10px Arial,sans-serif;letter-spacing:.02em;overflow:hidden}.pulseTag{color:#9fc5d5;letter-spacing:.14em}.pulseWindow{overflow:hidden;white-space:nowrap}.pulseTrack{display:inline-flex;min-width:max-content;animation:scroll 34s linear infinite}.pulseTrack span{display:inline-flex;align-items:center;gap:18px;margin-right:18px}.pulseTrack i{font-size:5px;color:#6f8d9b}.pulseOpen{font-size:9px;border-bottom:1px solid #f7f1e8;padding-bottom:2px}@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}.pulse:hover .pulseTrack{animation-play-state:paused}@media(max-width:650px){.pulse{grid-template-columns:auto 1fr;padding:0 12px}.pulseOpen{display:none}}`}</style></a>
}
