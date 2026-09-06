"use client";
import React from"react";

export type Row=Record<string,any>;
export type GeoFeature={properties:Record<string,any>;geometry:{type:string;coordinates:any}};
export type GeoJSON={type:string;features:GeoFeature[]};

export const txt=(x:any)=>String(x??"").trim();
export const num=(x:any)=>{if(x===null||x===undefined)return null;const s=String(x).trim();if(!s)return null;const v=Number(s.replace(/,/g,""));return Number.isFinite(v)?v:null};
export const norm=(x:any)=>String(x??"").toLowerCase().replace(/district|division|city|province|tehsil/g,"").replace(/[^a-z0-9]/g,"");
export function flatten(c:any,o:number[][]=[]):number[][]{if(!Array.isArray(c))return o;if(typeof c[0]==="number"&&typeof c[1]==="number")o.push(c);else c.forEach((x:any)=>flatten(x,o));return o}
export function svgPath(f:GeoFeature,b:any,w=820,h=780){const a=f.geometry.type==="Polygon"?f.geometry.coordinates:f.geometry.coordinates.flat();const sx=(x:number)=>20+(x-b.minX)/(b.maxX-b.minX||1)*(w-40),sy=(y:number)=>20+(b.maxY-y)/(b.maxY-b.minY||1)*(h-40);return a.map((r:any)=>r.map((p:number[],i:number)=>`${i?"L":"M"}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ")+" Z").join(" ")}

const aliases:Record<string,string>={
 "deghazikhan":"deraghazikhan","dgkhan":"deraghazikhan","deraghazikhan":"deraghazikhan",
 "rahimyarkhan":"rahimyarkhan",
 "naushahroferoze":"naushahroferoze","nowsheroferoze":"naushahroferoze",
 "qambarshahdadkot":"kambarshahdadkot","kambarshahdadkot":"kambarshahdadkot",
 "shaheedbenazirabad":"nawabshah","nawabshah":"nawabshah",
 "karachicentral":"karachicentral","karachieast":"karachieast","karachisouth":"karachisouth","karachiwest":"karachiwest",
 "chitrallower":"lowerchitral","lowerchitral":"lowerchitral","chitralupper":"upperchitral","upperchitral":"upperchitral",
 "kohistanlower":"lowerkohistan","lowerkohistan":"lowerkohistan","kohistanupper":"upperkohistan","upperkohistan":"upperkohistan",
 "lowerdir":"lowerdir","upperdir":"upperdir","deraismailkhan":"deraismailkhan"
};
export const canon=(x:any)=>aliases[norm(x)]||norm(x);

function quantiles(vals:number[]){const s=[...vals].sort((a,b)=>a-b);const q=(p:number)=>{if(!s.length)return 0;const i=(s.length-1)*p,l=Math.floor(i),h=Math.ceil(i);return s[l]+(s[h]-s[l])*(i-l)};return[q(.2),q(.4),q(.6),q(.8)]}
const fills=["#e4edf0","#bfd3db","#8fb4c2","#4f899f","#004d73"];
function fillFor(v:number|null,qs:number[]){if(v===null)return"#eee9e1";let i=0;while(i<qs.length&&v>qs[i])i++;return fills[i]}

export function RichDistrictMap({geo,bounds,index,boundary,metric,numeric,noteField,selected,toggle}:{geo:GeoJSON|null;bounds:any;index:Map<string,Row>;boundary:string;metric:string;numeric:string[];noteField:string;selected:string[];toggle:(x:string)=>void}){
 const[hover,setHover]=React.useState<any>(null);const vals=[...index.values()].map(r=>num(r[metric])).filter((x):x is number=>x!==null),qs=quantiles(vals),min=vals.length?Math.min(...vals):0,max=vals.length?Math.max(...vals):0;
 return <div className="mapwrap">{geo&&bounds?<svg viewBox="0 0 820 780" className="richmap" onMouseLeave={()=>setHover(null)}>{geo.features.map((f,i)=>{const name=txt(f.properties[boundary])||`Feature ${i+1}`,k=canon(name),r=index.get(k)||null,v=r?num(r[metric]):null,on=selected.includes(k);return <path key={i} d={svgPath(f,bounds)} fill={fillFor(v,qs)} stroke={on?"#111":"#8b908f"} strokeWidth={on?2:0.65} opacity={r?1:.45} onClick={()=>r&&toggle(k)} onMouseMove={e=>{const q=(e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();setHover({name,row:r,x:e.clientX-q.left,y:e.clientY-q.top})}}><title>{r?`${name}: ${metric} ${r[metric]}`:`${name}: no matched row`}</title></path>})}</svg>:<div className="empty">Loading district geography…</div>}{hover&&<div className="maptip" style={{left:Math.min(hover.x+16,650),top:Math.max(hover.y-12,12)}}><b>{hover.name}</b>{hover.row?<>{numeric.slice(0,6).map(c=><span key={c}>{c.replace(/_/g," ")}<strong>{fmt(hover.row[c])}</strong></span>)}{noteField&&txt(hover.row[noteField])&&<small>{txt(hover.row[noteField])}</small>}<em>Click district to pin / cross-filter.</em></>:<small>No dataset row matched this boundary.</small>}</div>}<div className="qlegend"><span>Low</span>{fills.map((c,i)=><i key={c} style={{background:c}} title={i<qs.length?`≤ ${fmt(qs[i])}`:`> ${fmt(qs[3])}`}/>) }<span>High</span><b>{fmt(min)} → {fmt(max)}</b></div></div>
}

export function fmt(v:any){const n=num(v);if(n===null)return"—";return n.toLocaleString(undefined,{maximumFractionDigits:2})}
export function rankStats(rows:Row[],metric:string,geo:string){const a=rows.filter(r=>num(r[metric])!==null).sort((x,y)=>(num(y[metric])||0)-(num(x[metric])||0));const vals=a.map(r=>num(r[metric])!);if(!a.length)return null;const med=[...vals].sort((x,y)=>x-y)[Math.floor(vals.length/2)],avg=vals.reduce((s,x)=>s+x,0)/vals.length;return{n:a.length,high:a[0],low:a[a.length-1],median:med,mean:avg,top:a.slice(0,5),bottom:a.slice(-5).reverse(),geo}}
export function RankedList({rows,metric,geo,onSelect}:{rows:Row[];metric:string;geo:string;onSelect:(k:string)=>void}){const s=rankStats(rows,metric,geo);if(!s)return null;const max=num(s.high[metric])||1;return <div className="ranklist">{s.top.map((r,i)=><button key={i} onClick={()=>onSelect(canon(r[geo]))}><span>{i+1}. {txt(r[geo])}</span><i><em style={{width:`${Math.max(2,(num(r[metric])||0)/max*100)}%`}}/></i><b>{fmt(r[metric])}</b></button>)}</div>}
