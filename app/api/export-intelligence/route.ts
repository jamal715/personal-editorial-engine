import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WORKBOOK_URL = "https://raw.githubusercontent.com/jamal715/Pakistan--Food-Non-Rice-Export-Data-Deep-Dive/main/TDAP_Export_Directory_HS01_24.xlsx";

type Row = Record<string, unknown>;
type Exporter = {
  key:string; name:string; ntn:string; value:number; hs8Count:number; hs4Count:number; largestHs8:string; share:number; cumulative:number; rank:number;
};
type Product = { hs8:string; hs4:string; name:string; value:number; exporters:number; share:number; rank:number };
type Tier = "A"|"B"|"C";
type Cache = { workbook:XLSX.WorkBook; chapters:{code:string; sheet:string; name:string}[] };
let cache:Cache | null = null;

function text(v:unknown){ return String(v ?? "").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim(); }
function num(v:unknown){ const n=Number(v); return Number.isFinite(n)?n:0; }
function hs(v:unknown,width:number){ const s=text(v).replace(/\.0$/," ").replace(/\D/g,""); return s.padStart(width,"0").slice(-width); }
function pick(row:Row,names:string[]){
  const map = new Map(Object.keys(row).map(k=>[k.trim().toLowerCase(),k]));
  for(const n of names){ const k=map.get(n.toLowerCase()); if(k) return row[k]; }
  return undefined;
}

async function loadWorkbook(){
  if(cache) return cache;
  const res = await fetch(WORKBOOK_URL,{next:{revalidate:3600}});
  if(!res.ok) throw new Error(`Workbook fetch failed: ${res.status}`);
  const wb = XLSX.read(await res.arrayBuffer(),{type:"array"});
  const chapters = wb.SheetNames.map(sheet=>{
    const m=sheet.match(/(?:^|\b)HS[_\s-]?(\d{1,2})(?:\b|\s)/i);
    if(!m) return null;
    const code=m[1].padStart(2,"0");
    const name=sheet.replace(/^HS[_\s-]?\d{1,2}\s*/i,"").trim() || `Chapter ${code}`;
    return {code,sheet,name};
  }).filter(Boolean) as {code:string;sheet:string;name:string}[];
  chapters.sort((a,b)=>Number(a.code)-Number(b.code));
  cache={workbook:wb,chapters};
  return cache;
}

function parseRows(wb:XLSX.WorkBook,sheetName:string){
  const ws=wb.Sheets[sheetName];
  const raw=XLSX.utils.sheet_to_json<Row>(ws,{defval:null,raw:true});
  return raw.map(r=>({
    exporterName:text(pick(r,["exporter_name","master_name","company_name_detail","company_name"])),
    ntn:text(pick(r,["ntn","detail_NTN","NTN"])),
    hs8:hs(pick(r,["hs8","ptc_code","pct_code"]),8),
    hs4:hs(pick(r,["hs4"]),4),
    productName:text(pick(r,["product_name","commodity_description"])),
    value:num(pick(r,["exported_value_rs","ExpSum","exported_value","export_value"])),
    records:num(pick(r,["reported_record_count","Count(*)","count"])),
  })).filter(r=>r.exporterName && /^\d{8}$/.test(r.hs8) && r.value>0);
}

function percentile(values:number[],target:number){
  const sorted=[...values].sort((a,b)=>a-b); let less=0, equal=0;
  for(const v of sorted){ if(v<target) less++; else if(v===target) equal++; }
  const rank=less+(equal+1)/2; return rank/sorted.length;
}

function analyse(rows:ReturnType<typeof parseRows>,code:string,name:string){
  const firms=new Map<string,{name:string;ntn:string;value:number;hs8:Set<string>;hs4:Set<string>;largestHs8:string;largestValue:number}>();
  const products=new Map<string,{hs8:string;hs4:string;name:string;value:number;firms:Set<string>}>();
  const firmProducts=new Map<string,{firmKey:string;name:string;ntn:string;hs8:string;hs4:string;product:string;value:number}>();

  for(const r of rows){
    const firmKey=`${r.ntn}|${r.exporterName}`;
    const f=firms.get(firmKey)??{name:r.exporterName,ntn:r.ntn,value:0,hs8:new Set<string>(),hs4:new Set<string>(),largestHs8:r.hs8,largestValue:-1};
    f.value+=r.value; f.hs8.add(r.hs8); f.hs4.add(r.hs4 || r.hs8.slice(0,4)); if(r.value>f.largestValue){f.largestValue=r.value;f.largestHs8=r.hs8;} firms.set(firmKey,f);
    const pKey=`${r.hs8}|${r.productName}`; const p=products.get(pKey)??{hs8:r.hs8,hs4:r.hs4||r.hs8.slice(0,4),name:r.productName||"Unlabelled product",value:0,firms:new Set<string>()}; p.value+=r.value;p.firms.add(firmKey);products.set(pKey,p);
    const fpKey=`${firmKey}|${r.hs8}`; const fp=firmProducts.get(fpKey)??{firmKey,name:r.exporterName,ntn:r.ntn,hs8:r.hs8,hs4:r.hs4||r.hs8.slice(0,4),product:r.productName||"Unlabelled product",value:0}; fp.value+=r.value; firmProducts.set(fpKey,fp);
  }

  const total=[...firms.values()].reduce((s,f)=>s+f.value,0);
  let cumulative=0;
  const exporters:Exporter[]=[...firms.entries()].sort((a,b)=>b[1].value-a[1].value).map(([key,f],i)=>{const share=total?f.value/total:0;cumulative+=share;return{key,name:f.name,ntn:f.ntn,value:f.value,hs8Count:f.hs8.size,hs4Count:f.hs4.size,largestHs8:f.largestHs8,share,cumulative,rank:i+1};});
  const shares=exporters.map(e=>e.share);
  const toThreshold=(t:number)=>Math.max(0,exporters.findIndex(e=>e.cumulative>=t)+1);
  const hhi=shares.reduce((s,x)=>s+x*x,0)*10000;

  const productList:Product[]=[...products.values()].sort((a,b)=>b.value-a.value).map((p,i)=>({hs8:p.hs8,hs4:p.hs4,name:p.name,value:p.value,exporters:p.firms.size,share:total?p.value/total:0,rank:i+1}));
  const firmValues=exporters.map(e=>e.value);
  const exporterByKey=new Map(exporters.map(e=>[e.key,e]));
  const byHs8=new Map<string,{total:number;items:{key:string;value:number}[]}>();
  for(const fp of firmProducts.values()){const x=byHs8.get(fp.hs8)??{total:0,items:[]};x.total+=fp.value;x.items.push({key:`${fp.firmKey}|${fp.hs8}`,value:fp.value});byHs8.set(fp.hs8,x);}
  for(const x of byHs8.values()) x.items.sort((a,b)=>b.value-a.value);
  const tierOrder:Record<Tier,number>={A:1,B:2,C:3};
  const strategic=[...firmProducts.values()].map(fp=>{
    const firm=exporterByKey.get(fp.firmKey)!; const hsInfo=byHs8.get(fp.hs8)!; const rank=hsInfo.items.findIndex(x=>x.key===`${fp.firmKey}|${fp.hs8}`)+1; const within=hsInfo.total?fp.value/hsInfo.total:0; const firmPct=percentile(firmValues,firm.value); const firmsIn=hsInfo.items.length;
    const topProduct=rank<=3, material=within>=.10, large=firmPct>=.90, scarce=firmsIn<=5;
    const tier:Tier=large&&topProduct&&material?"A":((topProduct&&material)||(large&&scarce)?"B":"C");
    return {tier,exporter:fp.name,hs8:fp.hs8,product:fp.product,chapterRank:firm.rank,hs8Rank:rank,firmsInHs8:firmsIn,shareWithinHs8:within,firmValue:firm.value,hs8Value:fp.value};
  }).sort((a,b)=>tierOrder[a.tier]-tierOrder[b.tier]||a.chapterRank-b.chapterRank||a.hs8Rank-b.hs8Rank);

  const top10=shares.slice(0,10).reduce((s,x)=>s+x,0), top5=shares.slice(0,5).reduce((s,x)=>s+x,0), top1=shares[0]||0;
  const concentrationLabel=hhi>=2500?"highly concentrated":hhi>=1500?"moderately concentrated":"relatively dispersed";
  const insight=[
    `The chapter contains ${exporters.length.toLocaleString()} observed exporters across ${productList.length.toLocaleString()} HS8 products.`,
    `The top 10 firms account for ${(top10*100).toFixed(1)}% of reported value; ${toThreshold(.60)} exporters are needed to reach 60%.`,
    `HHI is ${hhi.toFixed(0)}, indicating a ${concentrationLabel} exporter structure within this TDAP extract.`,
    productList[0]?`The largest observed HS8 line is ${productList[0].hs8} — ${productList[0].name} — at ${(productList[0].share*100).toFixed(1)}% of reported chapter value.`:"",
    `${strategic.filter(x=>x.tier==="A").length} exporter-product combinations meet the app’s Tier A evidence rule and ${strategic.filter(x=>x.tier==="B").length} meet Tier B.`
  ].filter(Boolean);

  return {
    chapter:{code,name},
    source:{label:"TDAP master exporter workbook used by Pakistan Export Intelligence",url:WORKBOOK_URL},
    kpis:{totalValue:total,exporters:exporters.length,products:productList.length,top1,top5,top10,hhi,to60:toThreshold(.60),to80:toThreshold(.80)},
    exporters:exporters.slice(0,25),
    products:productList.slice(0,20),
    concentration:exporters.map(e=>({rank:e.rank,cumulative:e.cumulative})),
    strategic:strategic.filter(x=>x.tier!=="C").slice(0,30),
    tierCounts:{A:strategic.filter(x=>x.tier==="A").length,B:strategic.filter(x=>x.tier==="B").length,C:strategic.filter(x=>x.tier==="C").length},
    insights:insight,
    guardrail:"Reported values, shares and rankings describe the selected TDAP extract. They are not automatically Pakistan national market shares; record count is not physical quantity."
  };
}

export async function GET(req:NextRequest){
  try{
    const {workbook,chapters}=await loadWorkbook();
    const requested=req.nextUrl.searchParams.get("chapter")?.padStart(2,"0")||"12";
    const selected=chapters.find(c=>c.code===requested)??chapters[0];
    const data=analyse(parseRows(workbook,selected.sheet),selected.code,selected.name);
    return NextResponse.json({chapters,data},{headers:{"Cache-Control":"public, s-maxage=3600, stale-while-revalidate=86400"}});
  }catch(error){
    console.error(error); return NextResponse.json({error:"Unable to load export intelligence workbook."},{status:500});
  }
}
