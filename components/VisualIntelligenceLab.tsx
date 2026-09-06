"use client";

import {useEffect,useMemo,useState} from "react";
import * as XLSX from "xlsx";

type Row=Record<string,any>;
type GeoFeature={type:string;properties:Record<string,any>;geometry:{type:string;coordinates:any}};
type GeoJSON={type:string;features:GeoFeature[]};
type Mode="map"|"bars"|"scatter"|"quality";

type VisualProject={
  name:string;
  mode:string;
  metric:string;
  secondaryMetric:string;
  geoField:string;
  placement:string;
  sourceNote:string;
  methodology:string;
};

const STORE="visual-intelligence-lab-v1";
const GEO_URL="https://raw.githubusercontent.com/PakData/GISData/master/PAK-GeoJSON/PAK_adm3.json";
const demo=`District,Infection ratio,Private beds,Population\nLahore,12.4,8450,13004135\nKarachi,18.8,11220,20382881\nFaisalabad,10.1,3910,9075319\nRawalpindi,9.4,4770,6119395\nMultan,14.6,3180,5362017\nPeshawar,16.9,2750,4758762\nQuetta,13.2,1680,2595368\nSialkot,7.9,1980,4499115`;

const normalise=(x:any)=>String(x??"").toLowerCase().replace(/district|division|city/g,"").replace(/[^a-z0-9]/g,"").trim();
const num=(x:any)=>{const n=Number(String(x??"").replace(/,/g,""));return Number.isFinite(n)?n:null};

function parseText(text:string):Row[]{
  const t=text.trim(); if(!t)return[];
  try{const j=JSON.parse(t);if(Array.isArray(j))return j;if(Array.isArray(j?.data))return j.data}catch{}
  const lines=t.split(/\r?\n/).filter(Boolean); if(lines.length<2)return[];
  const delim=lines[0].includes("\t")?"\t":lines[0].includes(";")?";":",";
  const headers=lines[0].split(delim).map(x=>x.trim());
  return lines.slice(1).map(line=>{const cells=line.split(delim);const r:Row={};headers.forEach((h,i)=>r[h]=cells[i]?.trim()??"");return r});
}

function infer(rows:Row[]){
  const cols=rows[0]?Object.keys(rows[0]):[];
  const numeric=cols.filter(c=>rows.filter(r=>r[c]!==""&&r[c]!=null).slice(0,50).filter(r=>num(r[c])!==null).length>=Math.max(2,Math.floor(Math.min(50,rows.length)*.65)));
  const geo=cols.find(c=>/district|city|province|region|tehsil|location|area/i.test(c))||cols.find(c=>rows.some(r=>typeof r[c]==="string"))||"";
  const date=cols.find(c=>/date|year|month|quarter|period/i.test(c))||"";
  return{cols,numeric,geo,date};
}

function flattenCoords(coords:any,out:number[][]=[]):number[][]{if(!Array.isArray(coords))return out;if(typeof coords[0]==="number"&&typeof coords[1]==="number")out.push(coords as number[]);else coords.forEach((x:any)=>flattenCoords(x,out));return out}

function pathFor(feature:GeoFeature,bounds:{minX:number;maxX:number;minY:number;maxY:number},w:number,h:number){
  const rings=feature.geometry.type==="Polygon"?feature.geometry.coordinates:feature.geometry.coordinates.flat();
  const sx=(x:number)=>24+(x-bounds.minX)/(bounds.maxX-bounds.minX)*(w-48);
  const sy=(y:number)=>24+(bounds.maxY-y)/(bounds.maxY-bounds.minY)*(h-48);
  return rings.map((ring:any)=>ring.map((p:number[],i:number)=>`${i?"L":"M"}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ")+" Z").join(" ");
}

function shade(v:number|null,min:number,max:number){if(v===null||!Number.isFinite(v))return"rgba(0,77,115,.07)";const t=max===min?.6:Math.max(0,Math.min(1,(v-min)/(max-min)));return `rgba(0,77,115,${(.16+t*.78).toFixed(2)})`}

export default function VisualIntelligenceLab(){
  const[rows,setRows]=useState<Row[]>([]);
  const[raw,setRaw]=useState("");
  const[geo,setGeo]=useState<GeoJSON|null>(null);
  const[mode,setMode]=useState<Mode>("map");
  const[hover,setHover]=useState<{name:string;row:Row|null;x:number;y:number}|null>(null);
  const[project,setProject]=useState<VisualProject>({name:"Untitled visual investigation",mode:"Visual-led",metric:"",secondaryMetric:"",geoField:"",placement:"After the claim this visual proves",sourceNote:"",methodology:""});

  useEffect(()=>{try{const x=JSON.parse(localStorage.getItem(STORE)||"{}");if(x.rows)setRows(x.rows);if(x.raw)setRaw(x.raw);if(x.project)setProject(x.project);if(x.mode)setMode(x.mode)}catch{};fetch(GEO_URL).then(r=>r.json()).then(setGeo).catch(()=>{})},[]);
  useEffect(()=>{try{localStorage.setItem(STORE,JSON.stringify({rows,raw,project,mode}))}catch{}},[rows,raw,project,mode]);
  const schema=useMemo(()=>infer(rows),[rows]);
  useEffect(()=>{if(rows.length){setProject(p=>({...p,geoField:p.geoField||schema.geo,metric:p.metric||schema.numeric[0]||"",secondaryMetric:p.secondaryMetric||schema.numeric[1]||""}))}},[rows,schema.geo,schema.numeric]);

  const mapData=useMemo(()=>{const idx=new Map<string,Row>();rows.forEach(r=>idx.set(normalise(r[project.geoField]),r));return idx},[rows,project.geoField]);
  const values=useMemo(()=>rows.map(r=>num(r[project.metric])).filter((x):x is number=>x!==null),[rows,project.metric]);
  const min=Math.min(...(values.length?values:[0])),max=Math.max(...(values.length?values:[1]));
  const bounds=useMemo(()=>{if(!geo)return null;const pts=geo.features.flatMap(f=>flattenCoords(f.geometry.coordinates));return{minX:Math.min(...pts.map(p=>p[0])),maxX:Math.max(...pts.map(p=>p[0])),minY:Math.min(...pts.map(p=>p[1])),maxY:Math.max(...pts.map(p=>p[1]))}},[geo]);
  const matched=useMemo(()=>geo?geo.features.filter(f=>mapData.has(normalise(f.properties.NAME_3))).length:0,[geo,mapData]);
  const missing=useMemo(()=>schema.cols.map(c=>({c,n:rows.filter(r=>r[c]===""||r[c]==null).length})).sort((a,b)=>b.n-a.n),[rows,schema.cols]);
  const duplicateGeo=useMemo(()=>{const seen=new Set<string>();let d=0;rows.forEach(r=>{const k=normalise(r[project.geoField]);if(k&&seen.has(k))d++;seen.add(k)});return d},[rows,project.geoField]);
  const sorted=useMemo(()=>[...rows].filter(r=>num(r[project.metric])!==null).sort((a,b)=>(num(b[project.metric])||0)-(num(a[project.metric])||0)).slice(0,18),[rows,project.metric]);

  async function fileIn(file:File){
    const ext=file.name.split(".").pop()?.toLowerCase();
    if(ext==="xlsx"||ext==="xls"){const ab=await file.arrayBuffer();const wb=XLSX.read(ab);const ws=wb.Sheets[wb.SheetNames[0]];const data=XLSX.utils.sheet_to_json(ws,{defval:""}) as Row[];setRows(data);setRaw(`[Excel workbook: ${file.name}]`);return}
    const text=await file.text();setRaw(text);setRows(parseText(text));
  }
  function analyse(){setRows(parseText(raw))}
  function useDemo(){setRaw(demo);setRows(parseText(demo))}
  function copySpec(){const spec={project,schema,rowCount:rows.length,visual:mode,matchedDistricts:matched,quality:{duplicateGeo,missing:missing.slice(0,5)}};navigator.clipboard.writeText(JSON.stringify(spec,null,2))}

  return <main className="vlab"><style>{css}</style>
    <header className="vtop"><div><a href="/editor">← Editorial Intelligence</a><b>Visual Intelligence</b><span>DATA → INSPECT → MODEL → VISUALISE → VERIFY → PLACE → PUBLISH</span></div><button onClick={copySpec}>Copy visual spec</button></header>
    <section className="hero"><div><span>VISUAL RESEARCH ENGINE</span><h1>Start with the data. Discover the story visually.</h1><p>Upload a spreadsheet, paste a table, use JSON, or begin with raw text. The engine infers fields, tests data quality, recommends visual grammar and builds an interactive research object.</p></div><div className="modes"><label>Project mode<select value={project.mode} onChange={e=>setProject({...project,mode:e.target.value})}><option>Visual-led</option><option>Article-led</option><option>Data investigation</option><option>Interactive explainer</option></select></label><label>Project name<input value={project.name} onChange={e=>setProject({...project,name:e.target.value})}/></label></div></section>

    <div className="workgrid">
      <aside className="left">
        <section className="panel ingest"><div className="eyebrow">01 INGEST</div><h2>Any comprehensible data</h2><label className="drop">Drop CSV, Excel, JSON or text<input type="file" accept=".csv,.tsv,.txt,.json,.xlsx,.xls" onChange={e=>e.target.files?.[0]&&fileIn(e.target.files[0])}/></label><textarea value={raw} onChange={e=>setRaw(e.target.value)} placeholder="Paste columns, CSV, JSON or a table copied from Excel"/><div className="buttons"><button onClick={analyse}>Read data</button><button className="ghost" onClick={useDemo}>Load district demo</button></div></section>
        <section className="panel"><div className="eyebrow">02 INSPECT</div><h2>Schema & quality</h2><div className="stats"><i><b>{rows.length}</b>rows</i><i><b>{schema.cols.length}</b>fields</i><i><b>{schema.numeric.length}</b>numeric</i><i><b>{duplicateGeo}</b>duplicate places</i></div><div className="chips">{schema.cols.map(c=><span key={c} className={schema.numeric.includes(c)?"num":""}>{c}</span>)}</div>{rows.length>0&&<div className="quality"><b>Largest missing-value checks</b>{missing.slice(0,4).map(x=><p key={x.c}><span>{x.c}</span><em>{x.n} missing</em></p>)}</div>}</section>
        <section className="panel"><div className="eyebrow">03 MODEL</div><h2>Tell the visual what fields mean</h2><label>Geography / entity<select value={project.geoField} onChange={e=>setProject({...project,geoField:e.target.value})}>{schema.cols.map(c=><option key={c}>{c}</option>)}</select></label><label>Primary metric<select value={project.metric} onChange={e=>setProject({...project,metric:e.target.value})}>{schema.numeric.map(c=><option key={c}>{c}</option>)}</select></label><label>Comparison metric<select value={project.secondaryMetric} onChange={e=>setProject({...project,secondaryMetric:e.target.value})}><option value="">None</option>{schema.numeric.filter(c=>c!==project.metric).map(c=><option key={c}>{c}</option>)}</select></label></section>
      </aside>

      <section className="canvas">
        <div className="canvasHead"><div><span>LIVE RESEARCH CANVAS</span><h2>{project.metric||"Choose a metric"}</h2><p>{mode==="map"?`${matched} Pakistan district boundaries matched to your data. Hover any district and switch metrics without rebuilding the map.`:"The same dataset can be interrogated through different visual grammars."}</p></div><div className="viewtabs">{(["map","bars","scatter","quality"] as Mode[]).map(x=><button key={x} className={mode===x?"on":""} onClick={()=>setMode(x)}>{x}</button>)}</div></div>
        <div className="visualStage">
          {mode==="map"&&<>{geo&&bounds?<svg viewBox="0 0 780 690" className="pakmap" onMouseLeave={()=>setHover(null)}>{geo.features.map((f,i)=>{const name=f.properties.NAME_3;const row=mapData.get(normalise(name))||null;const v=row?num(row[project.metric]):null;return <path key={f.properties.GID_3||i} d={pathFor(f,bounds,780,690)} fill={shade(v,min,max)} stroke="rgba(32,36,38,.45)" strokeWidth=".65" onMouseMove={e=>{const r=(e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();setHover({name,row,x:e.clientX-r.left,y:e.clientY-r.top})}}/>})}</svg>:<div className="empty">Loading Pakistan district geometry…</div>}{hover&&<div className="tip" style={{left:Math.min(hover.x+14,590),top:Math.max(hover.y-20,10)}}><b>{hover.name}</b>{hover.row?schema.numeric.map(c=><span key={c}>{c}<strong>{String(hover.row?.[c]??"")}</strong></span>):<small>No matched row in current data</small>}</div>}<div className="legend"><span>{project.metric||"Metric"}</span><i/><small>{Number.isFinite(min)?min.toLocaleString():"0"}</small><small>{Number.isFinite(max)?max.toLocaleString():"0"}</small></div></>}
          {mode==="bars"&&<div className="bars">{sorted.map((r,i)=>{const v=num(r[project.metric])||0;const pct=max?Math.max(2,v/max*100):0;return <div className="barrow" key={i}><span>{String(r[project.geoField]||`Row ${i+1}`)}</span><div><i style={{width:`${pct}%`}}/></div><b>{v.toLocaleString()}</b></div>})}</div>}
          {mode==="scatter"&&<Scatter rows={rows} x={project.metric} y={project.secondaryMetric} label={project.geoField}/>} 
          {mode==="quality"&&<div className="qboard"><h3>Due diligence before design</h3><div className="qgrid"><article><b>{rows.length}</b><span>observations</span></article><article><b>{matched}</b><span>districts matched</span></article><article><b>{geo?geo.features.length-matched:0}</b><span>unmatched boundaries</span></article><article><b>{duplicateGeo}</b><span>duplicate geography keys</span></article></div><h4>What the engine should challenge</h4><p>Are ratios percentages or fractions? Are volumes absolute counts or per-capita measures? Are district names from the same administrative vintage as the boundary file? Are missing districts truly zero, or simply absent? These checks stay attached to the visual as provenance.</p></div>}
        </div>
        <div className="insightbar"><div><span>VISUAL GRAMMAR</span><b>{rows.length?recommend(schema,project):"Waiting for data"}</b></div><div><span>INTERACTION</span><b>Hover · metric switch · filters · drill-down ready</b></div><div><span>GEOGRAPHY MATCH</span><b>{rows.length?`${matched} matched districts`:"No dataset"}</b></div></div>
      </section>

      <aside className="right">
        <section className="panel"><div className="eyebrow">04 DESIGN SYSTEM</div><h2>Sky-is-the-limit visual grammar</h2><div className="library">{["Choropleth map","Proportional symbols","Flow map","Route map","Time series","Small multiples","Scatter / bubble","Heatmap","Matrix","Sankey","Network graph","Treemap","Sunburst","Waterfall","Distribution","Beeswarm","Slope chart","Bump chart","Scenario simulator","Story map"].map(x=><button key={x} onClick={()=>setMode(x.includes("map")?"map":x.includes("Scatter")?"scatter":x.includes("quality")?"quality":"bars")}>{x}</button>)}</div></section>
        <section className="panel"><div className="eyebrow">05 VERIFY</div><h2>Visual provenance</h2><label>Source<textarea value={project.sourceNote} onChange={e=>setProject({...project,sourceNote:e.target.value})} placeholder="Source, URL, file, date, data owner"/></label><label>Method / transformation<textarea value={project.methodology} onChange={e=>setProject({...project,methodology:e.target.value})} placeholder="Filters, denominator, calculated fields, uncertainty, exclusions"/></label><div className="checklist"><p>✓ Source field</p><p>✓ Method field</p><p className={!project.sourceNote?"warn":""}>{project.sourceNote?"✓":"!"} provenance note</p><p className={!project.methodology?"warn":""}>{project.methodology?"✓":"!"} transformation note</p></div></section>
        <section className="panel"><div className="eyebrow">06 PLACE</div><h2>Put the visual where the argument needs it</h2><select value={project.placement} onChange={e=>setProject({...project,placement:e.target.value})}><option>After the claim this visual proves</option><option>Before the explanation</option><option>Full-width visual break</option><option>Hero visual before text</option><option>Visual-first article body</option><option>Methodology / appendix</option></select><p className="placement">The final article renderer will treat the visual as a first-class block, not an image pasted at the end.</p></section>
      </aside>
    </div>
  </main>
}

function recommend(schema:ReturnType<typeof infer>,project:VisualProject){if(project.geoField&&/district|province|region|city|tehsil|location|area/i.test(project.geoField)&&project.metric)return"Choropleth or proportional-symbol map";if(schema.date&&project.metric)return"Interactive time series";if(project.metric&&project.secondaryMetric)return"Scatter, bubble or quadrant matrix";return"Ranked bars, distribution or small multiples"}

function Scatter({rows,x,y,label}:{rows:Row[];x:string;y:string;label:string}){const pts=rows.map(r=>({x:num(r[x]),y:num(r[y]),l:String(r[label]??"")})).filter(p=>p.x!==null&&p.y!==null) as {x:number;y:number;l:string}[];if(!x||!y||!pts.length)return <div className="empty">Choose two numeric metrics to build a relationship view.</div>;const xmin=Math.min(...pts.map(p=>p.x)),xmax=Math.max(...pts.map(p=>p.x)),ymin=Math.min(...pts.map(p=>p.y)),ymax=Math.max(...pts.map(p=>p.y));return <svg viewBox="0 0 780 610" className="scatter"><line x1="70" x2="740" y1="545" y2="545"/><line x1="70" x2="70" y1="35" y2="545"/>{pts.map((p,i)=>{const cx=70+(p.x-xmin)/(xmax-xmin||1)*670,cy=545-(p.y-ymin)/(ymax-ymin||1)*510;return <g key={i}><circle cx={cx} cy={cy} r="7"><title>{p.l}: {x} {p.x}, {y} {p.y}</title></circle></g>})}<text x="400" y="590">{x}</text><text x="18" y="300" transform="rotate(-90 18 300)">{y}</text></svg>}

const css=`*{box-sizing:border-box}.vlab{min-height:100vh;background:#f3efe8;color:#202426;font-family:Arial,Helvetica,sans-serif}.vtop{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;padding:12px 22px;background:#202426;color:#f7f1e8}.vtop>div{display:flex;gap:16px;align-items:baseline}.vtop a,.vtop span{font-size:9px;color:#9bb0b8}.vtop b{font:700 18px Georgia,serif}.vtop button,.buttons button{border:0;background:#004d73;color:white;padding:9px 12px;font-weight:700;font-size:9px}.hero{display:grid;grid-template-columns:1.4fr .6fr;gap:28px;padding:34px 28px 26px;border-bottom:1px solid #cfc7bc}.hero span,.eyebrow,.canvasHead span,.insightbar span{font-size:8px;font-weight:800;letter-spacing:.15em;color:#004d73}.hero h1{margin:8px 0 10px;font:700 clamp(38px,5vw,62px)/.95 Georgia,serif;max-width:900px}.hero p{max-width:850px;font:17px/1.5 Georgia,serif;color:#596063}.modes{display:grid;gap:12px;align-content:end}.modes label,.panel label{display:grid;gap:5px;font-size:9px;font-weight:800}.modes input,.modes select,.panel select,.panel input,.panel textarea{width:100%;border:1px solid #c8c0b6;background:#fff;padding:9px;font:11px Arial}.workgrid{display:grid;grid-template-columns:300px minmax(0,1fr) 300px;gap:14px;padding:14px}.left,.right{display:grid;gap:14px;align-content:start}.panel{background:#fbf8f3;border:1px solid #d5cec4;padding:15px}.panel h2{margin:5px 0 12px;font:700 20px Georgia,serif}.panel textarea{min-height:90px;resize:vertical}.ingest textarea{min-height:170px}.drop{display:block;border:1px dashed #91aab5;padding:14px;margin-bottom:10px;background:#eef4f5}.drop input{margin-top:8px;padding:0;border:0;background:none}.buttons{display:flex;gap:8px}.buttons .ghost{background:transparent;color:#202426;border:1px solid #202426}.stats{display:grid;grid-template-columns:1fr 1fr;gap:7px}.stats i{font-style:normal;background:#f1ece4;padding:9px;font-size:8px}.stats b{display:block;font:700 20px Georgia,serif}.chips{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0}.chips span{padding:5px 7px;border:1px solid #d7d0c6;font-size:8px}.chips .num{border-color:#6b9aae;color:#004d73}.quality{border-top:1px solid #ddd6cc;padding-top:9px;font-size:9px}.quality p{display:flex;justify-content:space-between;margin:6px 0}.quality em{font-style:normal;color:#777}.canvas{background:#fbf8f3;border:1px solid #cfc7bc;min-width:0}.canvasHead{display:flex;justify-content:space-between;gap:18px;padding:17px;border-bottom:1px solid #d8d1c7}.canvasHead h2{margin:5px 0;font:700 28px Georgia,serif}.canvasHead p{margin:0;max-width:680px;font:12px/1.45 Georgia,serif;color:#666}.viewtabs{display:flex;gap:5px;align-items:start}.viewtabs button{border:1px solid #ccc4ba;background:#f5f1eb;padding:7px 9px;font-size:8px;text-transform:uppercase}.viewtabs .on{background:#202426;color:#fff}.visualStage{position:relative;min-height:690px;padding:8px}.pakmap{display:block;width:100%;height:690px;background:#f7f2ea}.pakmap path{transition:fill .15s;cursor:crosshair}.pakmap path:hover{stroke:#202426;stroke-width:1.5}.tip{position:absolute;z-index:5;width:210px;background:#202426;color:#fff;padding:10px;box-shadow:0 10px 30px rgba(0,0,0,.25);pointer-events:none}.tip b{display:block;font:700 16px Georgia,serif;margin-bottom:6px}.tip span{display:flex;justify-content:space-between;gap:10px;font-size:8px;border-top:1px solid #43494b;padding:5px 0}.tip strong{font-size:9px}.tip small{font-size:9px;color:#ccc}.legend{position:absolute;left:24px;bottom:22px;width:190px;background:#fbf8f3;border:1px solid #d3ccc2;padding:9px}.legend span{display:block;font-size:8px;font-weight:700}.legend i{display:block;height:8px;margin:7px 0;background:linear-gradient(90deg,rgba(0,77,115,.16),rgba(0,77,115,.94))}.legend small:last-child{float:right}.bars{padding:30px 22px}.barrow{display:grid;grid-template-columns:150px 1fr 80px;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #e0dad1}.barrow span{font-size:9px}.barrow>div{height:16px;background:#ebe5dc}.barrow i{display:block;height:100%;background:#004d73}.barrow b{text-align:right;font-size:10px}.scatter{width:100%;height:650px}.scatter line{stroke:#aaa}.scatter circle{fill:#004d73;opacity:.68}.scatter text{font-size:12px;fill:#666}.empty{display:grid;place-items:center;min-height:620px;color:#777;font:16px Georgia,serif}.qboard{padding:42px}.qboard h3{font:700 31px Georgia,serif}.qgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.qgrid article{padding:16px;border-top:3px solid #202426;background:#f0ebe3}.qgrid b{display:block;font:700 30px Georgia,serif}.qgrid span{font-size:9px}.qboard h4{margin-top:30px}.qboard p{max-width:760px;font:17px/1.55 Georgia,serif}.insightbar{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid #d4cdc3}.insightbar>div{padding:12px;border-right:1px solid #ddd6cd}.insightbar b{display:block;margin-top:4px;font:700 12px Georgia,serif}.library{display:grid;grid-template-columns:1fr 1fr;gap:6px}.library button{border:1px solid #d4cdc3;background:#f3eee7;text-align:left;padding:7px;font-size:8px}.checklist{margin-top:10px;border-top:1px solid #ddd6cd}.checklist p{font-size:9px}.checklist .warn{color:#9c4b30}.placement{font:12px/1.5 Georgia,serif;color:#666}@media(max-width:1180px){.workgrid{grid-template-columns:250px 1fr}.right{grid-column:1/-1;grid-template-columns:repeat(3,1fr)}}@media(max-width:800px){.hero,.workgrid{grid-template-columns:1fr}.right{grid-template-columns:1fr}.vtop span{display:none}.canvasHead{flex-direction:column}.visualStage{min-height:560px}.pakmap{height:560px}.qgrid{grid-template-columns:1fr 1fr}.barrow{grid-template-columns:100px 1fr 60px}}`;
