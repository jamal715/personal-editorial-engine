"use client";

import {useEffect,useMemo,useState} from "react";

const STORE="jamal-publishing-desk-v1";
const EDITOR="jamal-editorial-intelligence-v5";
const COMPOSE="jamal-simple-article-composer-v1";
const MEDIUM_ROUTE="/article/precision-recall-text-summarization";

type Checks={argument:boolean;evidence:boolean;uncertainty:boolean;visuals:boolean;mobile:boolean;proof:boolean};
type Device="desktop"|"mobile";

type ComposeState={title:string;section:string;html:string};

function cleanWords(html:string){return html.replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim().split(" ").filter(Boolean).length}
function routeFor(title:string){return /precision and recall in text summarization/i.test(title)?MEDIUM_ROUTE:""}

export default function PublishingDesk(){
 const[checks,setChecks]=useState<Checks>({argument:false,evidence:false,uncertainty:false,visuals:false,mobile:false,proof:false});
 const[compose,setCompose]=useState<ComposeState|null>(null);
 const[fallbackTitle,setFallbackTitle]=useState("Pakistan built for electricity scarcity. Now the grid is losing demand.");
 const[device,setDevice]=useState<Device>("desktop");
 const[notice,setNotice]=useState("");
 const[published,setPublished]=useState(false);

 useEffect(()=>{try{
   const saved=JSON.parse(localStorage.getItem(STORE)||"{}");if(saved.checks)setChecks(saved.checks);if(saved.published)setPublished(true);
   const c=JSON.parse(localStorage.getItem(COMPOSE)||"{}");
   if(c.title||c.html){setCompose({title:String(c.title||"Untitled article"),section:String(c.section||"Tech"),html:String(c.html||"")});return}
   const e=JSON.parse(localStorage.getItem(EDITOR)||"{}");if(e.title)setFallbackTitle(e.title);
 }catch{}},[]);
 useEffect(()=>{try{localStorage.setItem(STORE,JSON.stringify({checks,published}))}catch{}},[checks,published]);

 const title=compose?.title||fallbackTitle;
 const section=compose?.section||"Research";
 const html=compose?.html||"";
 const words=useMemo(()=>cleanWords(html),[html]);
 const ready=Object.values(checks).filter(Boolean).length;
 const score=Math.round(ready/Object.keys(checks).length*100);
 const route=routeFor(title);

 const items:[keyof Checks,string,string][]=[
  ["argument","Argument","Headline, opening and section order read coherently in the preview."],
  ["evidence","Evidence","Claims that need sourcing or checking have been reviewed."],
  ["uncertainty","Uncertainty","Any estimates, caveats or limitations are visible where needed."],
  ["visuals","Visual QA","Images and figures sit at the right point and every caption is final."],
  ["mobile","Responsive QA","Switch to mobile preview below and inspect the complete article."],
  ["proof","Final proof","You have completed the final human read before release."]
 ];
 function toggle(k:keyof Checks){setChecks(x=>({...x,[k]:!x[k]}))}
 function publish(){
   if(score<100){setNotice("Clear all six release gates before publishing.");return}
   if(!compose){setNotice("No Compose draft is loaded. Return to Compose and save the article first.");return}
   if(!route){setNotice("Preview is ready, but this draft does not yet have a permanent public route. The generic server-side publisher is the next backend step.");return}
   setPublished(true);localStorage.setItem("jamal-last-published-route",route);setNotice("Published. Opening the canonical article route.");setTimeout(()=>window.open(route,"_blank"),450)
 }

 return <main className="pub"><style>{css}</style><header><div><a href={compose?"/editor/compose":"/editor"}>← {compose?"Compose":"Editorial Intelligence"}</a><b>Publishing Desk</b></div>{route&&<a className="live" href={route} target="_blank">Open public route ↗</a>}</header>{notice&&<div className="notice" onClick={()=>setNotice("")}>{notice}</div>}

 <section className="hero"><div><span>07 PUBLISH</span><h1>Preview it exactly. Then release it.</h1><p>This desk now reads the article you were actually composing. Review the public presentation, inspect desktop and mobile, clear the release gates and publish from the same screen.</p></div><div className="score"><b>{score}%</b><span>{ready}/6 release gates cleared</span></div></section>

 {compose?<>
 <section className="draftSummary"><div><span>CURRENT DRAFT</span><h2>{title}</h2><p>{section} · {words.toLocaleString()} words · sourced directly from Compose</p></div><div className="summaryActions"><a href="/editor/compose">Edit article</a><button className="primary" onClick={publish}>{published?"Published ✓":"Publish to public site"}</button></div></section>

 <section className="previewWrap"><div className="previewTop"><div><span>PUBLIC PREVIEW</span><b>This is how the article will read on the site.</b></div><div className="devices"><button className={device==="desktop"?"active":""} onClick={()=>setDevice("desktop")}>Desktop</button><button className={device==="mobile"?"active":""} onClick={()=>setDevice("mobile")}>Mobile</button></div></div><div className={`stage ${device}`}><article className="pagePreview"><header className="articleHeader"><a>Jamal Nasir</a><span>{section}</span></header><div className="articleBody"><div className="category">{section}</div><h1>{title}</h1><div className="byline">By Jamal Nasir · Preview</div><div className="rendered" dangerouslySetInnerHTML={{__html:html}}/></div></article></div></section>
 </>:<section className="noDraft"><span>NO COMPOSE DRAFT DETECTED</span><h2>The publishing desk is still showing the older research workflow.</h2><p>Open Compose, write or paste the article, and return here. This page will then switch to the article preview automatically.</p><a href="/editor/compose">Open Compose</a></section>}

 <section className="gates"><div className="label">RELEASE GATES</div>{items.map(([k,name,desc])=><button key={k} className={checks[k]?"done":""} onClick={()=>toggle(k)}><i>{checks[k]?"✓":""}</i><div><b>{name}</b><p>{desc}</p></div><span>{checks[k]?"CLEARED":"REVIEW"}</span></button>)}</section>

 {compose&&<section className="releaseBar"><div><span>READY TO RELEASE?</span><b>{score===100?"All six checks are cleared.":`${6-ready} release ${6-ready===1?"check remains":"checks remain"}.`}</b><p>The publish control stays here so preview and release are one continuous workflow.</p></div><button disabled={score<100} onClick={publish}>{published?"Published ✓":"Publish article"}</button></section>}
 </main>
}

const css=`*{box-sizing:border-box}.pub{min-height:100vh;background:#f7f1e8;color:#202426;font-family:Arial,sans-serif}.pub>header{height:66px;background:#101617;color:#fff;display:flex;justify-content:space-between;align-items:center;padding:0 28px}.pub>header div{display:flex;gap:22px;align-items:center}.pub>header a{color:#d6e0e3;text-decoration:none;font-size:12px}.pub>header b{font:700 22px Georgia,serif}.pub .live{border:1px solid #50636a;padding:9px 12px;color:#fff}.notice{position:fixed;right:22px;top:82px;background:#004d73;color:white;padding:12px 16px;z-index:80;cursor:pointer;max-width:420px;font-size:12px;line-height:1.45}.hero,.draftSummary,.previewWrap,.gates,.releaseBar,.noDraft{width:min(1120px,calc(100% - 36px));margin-left:auto;margin-right:auto}.hero{padding:48px 0 36px;display:grid;grid-template-columns:1fr 220px;gap:40px;border-bottom:1px solid #d8d4cd}.hero>div>span,.draftSummary span,.previewTop span,.label,.releaseBar span,.noDraft span{font-size:10px;font-weight:900;letter-spacing:.14em;color:#004d73}.hero h1{font:700 clamp(42px,5vw,66px)/.98 Georgia,serif;letter-spacing:-.04em;margin:10px 0 12px}.hero p{font:18px/1.55 Georgia,serif;max-width:760px;color:#51595c}.score{border-left:1px solid #d8d4cd;padding-left:26px;align-self:end}.score b{display:block;font:700 54px Georgia,serif}.score span{color:#6d7375;font-size:11px}.draftSummary{padding:24px 0;border-bottom:1px solid #d8d4cd;display:flex;justify-content:space-between;align-items:end;gap:28px}.draftSummary h2{font:700 32px/1.06 Georgia,serif;margin:8px 0 6px;max-width:760px}.draftSummary p{margin:0;color:#6d7375;font-size:12px}.summaryActions{display:flex;gap:8px;flex-shrink:0}.summaryActions a,.summaryActions button{border:1px solid #004d73;background:transparent;color:#004d73;padding:10px 13px;text-decoration:none;font-size:11px;font-weight:800;cursor:pointer}.summaryActions .primary{background:#004d73;color:#fff}.previewWrap{padding:34px 0 8px}.previewTop{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:12px}.previewTop b{display:block;margin-top:5px;font:700 20px Georgia,serif}.devices{display:flex;border:1px solid #bfb8ae}.devices button{border:0;background:transparent;padding:8px 11px;font-size:10px;cursor:pointer;color:#5a6265}.devices .active{background:#202426;color:#fff}.stage{background:#ddd7cf;padding:30px;min-height:520px;transition:.2s}.stage.mobile{display:flex;justify-content:center}.pagePreview{background:var(--reader-bg,#fbf8f3);color:var(--reader-text,#343a3d);min-height:640px;margin:0 auto;box-shadow:0 10px 35px rgba(36,39,40,.12);transition:width .2s}.stage.desktop .pagePreview{width:100%}.stage.mobile .pagePreview{width:390px;max-width:100%}.articleHeader{height:56px;border-bottom:1px solid #d8d4cd;display:flex;justify-content:space-between;align-items:center;padding:0 24px;font-size:11px}.articleHeader a{font-weight:900}.articleHeader span{color:#004d73;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.articleBody{width:min(var(--reader-width,760px),calc(100% - 40px));margin:0 auto;padding:48px 0 70px}.category{font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#004d73}.articleBody>h1{font:700 clamp(40px,5vw,66px)/.98 var(--reader-font,Georgia,serif);letter-spacing:-.04em;margin:10px 0 15px;color:var(--reader-ink,#202426)}.stage.mobile .articleBody>h1{font-size:40px}.byline{font-size:11px;color:#747b7e;border-bottom:1px solid #d8d4cd;padding-bottom:20px;margin-bottom:28px}.rendered{font:var(--reader-size,19px)/1.72 var(--reader-font,Georgia,serif);color:var(--reader-text,#343a3d)}.rendered p{margin:0 0 1.35em}.rendered h2{font:700 1.65em/1.08 var(--reader-font,Georgia,serif);margin:1.8em 0 .6em;color:var(--reader-ink,#202426)}.rendered blockquote{border-left:3px solid #004d73;margin:30px 0;padding:4px 0 4px 20px;font-style:italic}.rendered figure{margin:36px 0}.rendered figure img{display:block;max-width:100%;height:auto;margin:0 auto}.rendered figcaption{margin-top:9px;text-align:center;color:#777f82;font:italic 13px/1.5 Georgia,serif}.gates{padding:40px 0}.label{margin-bottom:10px}.gates button{width:100%;border:0;border-top:1px solid #d8d4cd;background:transparent;padding:16px 0;display:grid;grid-template-columns:34px 1fr 80px;gap:14px;text-align:left;cursor:pointer}.gates button:last-child{border-bottom:1px solid #d8d4cd}.gates i{width:22px;height:22px;border:1px solid #a9a39b;display:grid;place-items:center;font-style:normal}.gates .done i{background:#004d73;color:#fff;border-color:#004d73}.gates b{font:700 19px Georgia,serif}.gates p{margin:3px 0 0;color:#707678;font-size:12px}.gates>button>span{font-size:10px;font-weight:900;letter-spacing:.08em;color:#8a8f90;align-self:center}.gates .done>span{color:#2d6a43}.releaseBar{margin-bottom:70px;border-top:4px solid #202426;border-bottom:1px solid #d8d4cd;padding:24px 0;display:flex;align-items:center;justify-content:space-between;gap:28px}.releaseBar b{display:block;font:700 26px Georgia,serif;margin-top:6px}.releaseBar p{margin:5px 0 0;color:#687074;font-size:12px}.releaseBar button{border:1px solid #004d73;background:#004d73;color:white;padding:13px 18px;font-size:12px;font-weight:900;cursor:pointer;min-width:170px}.releaseBar button:disabled{opacity:.35;cursor:not-allowed}.noDraft{margin-top:42px;padding:30px 0;border-top:4px solid #202426;border-bottom:1px solid #d8d4cd}.noDraft h2{font:700 34px Georgia,serif}.noDraft p{font:17px/1.6 Georgia,serif;max-width:740px}.noDraft a{display:inline-block;background:#004d73;color:#fff;padding:11px 14px;text-decoration:none;font-size:11px;font-weight:800}@media(max-width:780px){.hero{grid-template-columns:1fr}.score{border-left:0;border-top:1px solid #d8d4cd;padding:18px 0 0}.draftSummary,.releaseBar{align-items:flex-start;flex-direction:column}.previewTop{align-items:flex-start;flex-direction:column}.stage{padding:12px}.articleBody{padding-top:34px}.summaryActions{width:100%;flex-wrap:wrap}}`;
