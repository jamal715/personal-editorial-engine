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
  return <a className="pulse" href="/article/pakistan-food-export-intelligence" aria-label="Open export research"><span className="pulseTag">RESEARCH PULSE</span><div className="pulseWindow"><div className="pulseTrack">{[...items,...items].map((x,i)=><span key={i}>{x}<i>•</i></span>)}</div></div><span className="pulseOpen">OPEN</span><style>{`.pulse{height:36px;background:#004d73;color:#fff;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:20px;padding:0 24px;font:800 11px/1 Arial,sans-serif;letter-spacing:.02em;overflow:hidden;text-decoration:none}.pulseTag{color:#fff;letter-spacing:.15em;font-weight:900}.pulseWindow{overflow:hidden;white-space:nowrap}.pulseTrack{display:inline-flex;min-width:max-content;animation:scroll 34s linear infinite}.pulseTrack span{display:inline-flex;align-items:center;gap:18px;margin-right:18px;color:#fff}.pulseTrack i{font-size:8px;color:rgba(255,255,255,.55);font-style:normal}.pulseOpen{font-size:10px;color:#fff;border-bottom:1px solid rgba(255,255,255,.85);padding-bottom:2px;font-weight:900}@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}.pulse:hover .pulseTrack{animation-play-state:paused}@media(max-width:650px){.pulse{grid-template-columns:auto 1fr;padding:0 12px}.pulseOpen{display:none}.pulseTag{font-size:9px}}`}</style></a>
}
