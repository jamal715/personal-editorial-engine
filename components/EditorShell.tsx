"use client";

import {useEffect,useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import EditorialIntelligenceStudioV5 from "./EditorialIntelligenceStudioV5";

const STORAGE="jamal-editorial-intelligence-v5";
const ARCHIVES="jamal-editorial-archives-v1";
type Archive={id:string;title:string;archivedAt:string;snapshot:string};

export default function EditorShell(){
  const router=useRouter();
  const[archives,setArchives]=useState<Archive[]>([]);
  const[showArchives,setShowArchives]=useState(false);

  const readArchives=()=>{try{return JSON.parse(localStorage.getItem(ARCHIVES)||"[]") as Archive[]}catch{return[]}};
  useEffect(()=>{setArchives(readArchives())},[]);
  useEffect(()=>{
    const handler=(event:MouseEvent)=>{
      const el=(event.target as HTMLElement).closest("button");
      const text=el?.textContent?.trim();
      if(text==="06 Visuals"||text==="07 Publish"){
        event.preventDefault();
        event.stopPropagation();
        router.push(text==="06 Visuals"?"/editor/visuals":"/editor/publish");
      }
    };
    document.addEventListener("click",handler,true);
    return()=>document.removeEventListener("click",handler,true);
  },[router]);

  function current(){return localStorage.getItem(STORAGE)||""}
  function archiveCurrent(startNew=true){
    const snapshot=current();
    if(!snapshot){if(startNew)newArticle();return}
    let title="Untitled article";
    try{title=JSON.parse(snapshot).title?.trim()||title}catch{}
    const next=[{id:crypto.randomUUID(),title,archivedAt:new Date().toISOString(),snapshot},...readArchives()];
    localStorage.setItem(ARCHIVES,JSON.stringify(next));
    setArchives(next);
    if(startNew){localStorage.removeItem(STORAGE);localStorage.removeItem("jamal-editorial-intelligence-v4");location.reload()}
  }
  function newArticle(){
    const snapshot=current();
    if(snapshot&&!confirm("Start a blank article and discard the current local draft? Use ‘Archive & new’ if you want to keep it."))return;
    localStorage.removeItem(STORAGE);localStorage.removeItem("jamal-editorial-intelligence-v4");location.reload();
  }
  function restore(a:Archive){
    const currentSnapshot=current();
    if(currentSnapshot&&!confirm("Restore this archived project over the current editor project?"))return;
    localStorage.setItem(STORAGE,a.snapshot);setShowArchives(false);location.reload();
  }
  function removeArchive(id:string){
    if(!confirm("Delete this archived local project?"))return;
    const next=readArchives().filter(a=>a.id!==id);localStorage.setItem(ARCHIVES,JSON.stringify(next));setArchives(next);
  }
  const count=useMemo(()=>archives.length,[archives]);

  return <div className="editorHost"><style>{css}</style><div className="projectbar"><div className="projectbarLeft"><span>PROJECT</span><b>Editorial workspace</b></div><div className="projectbarActions"><button className="manage" onClick={()=>router.push('/editor/publications')}>☰ Manage public articles</button><button className="compose" onClick={()=>router.push('/editor/compose')}>✎ Compose article</button><button className="quiet" onClick={()=>setShowArchives(true)}>Local archives {count?`(${count})`:""}</button><button className="quiet" onClick={()=>archiveCurrent(true)}>Archive & new</button><button className="new" onClick={newArticle}>+ New research project</button></div></div><EditorialIntelligenceStudioV5/>{showArchives&&<div className="archiveOverlay" onMouseDown={e=>{if(e.target===e.currentTarget)setShowArchives(false)}}><section className="archivePanel"><header><div><span>LOCAL ARCHIVES</span><h2>Previous article projects</h2></div><button onClick={()=>setShowArchives(false)}>Close</button></header>{archives.length===0?<p className="empty">No archived projects yet. “Archive & new” stores the current editor state here before opening a blank project.</p>:<div className="archiveList">{archives.map(a=><article key={a.id}><div><b>{a.title}</b><small>{new Date(a.archivedAt).toLocaleString()}</small></div><div className="archiveActions"><button onClick={()=>restore(a)}>Restore</button><button className="delete" onClick={()=>removeArchive(a.id)}>Delete</button></div></article>)}</div>}</section></div>}</div>
}

const css=`.editorHost{min-height:100vh}.projectbar{height:46px;background:#f7f1e8;border-bottom:1px solid #d8d4cd;display:flex;align-items:center;justify-content:space-between;padding:0 20px;position:sticky;top:0;z-index:1000;font-family:Arial,sans-serif}.projectbarLeft{display:flex;align-items:baseline;gap:10px}.projectbarLeft span{font-size:9px;font-weight:900;letter-spacing:.14em;color:#004d73}.projectbarLeft b{font-size:12px;color:#343a3d}.projectbarActions{display:flex;gap:8px}.projectbar button{border:1px solid #c8c2b9;background:transparent;color:#343a3d;padding:7px 10px;font-size:11px;font-weight:800;cursor:pointer}.projectbar button.manage{background:#fbf8f3;border-color:#004d73;color:#004d73}.projectbar button.compose{background:#202426;color:#fff;border-color:#202426}.projectbar button.new{background:#004d73;border-color:#004d73;color:#fff}.projectbar button:hover{border-color:#004d73}.archiveOverlay{position:fixed;inset:0;background:rgba(32,36,38,.46);z-index:2000;display:grid;place-items:center;padding:24px}.archivePanel{width:min(720px,100%);max-height:78vh;overflow:auto;background:#fbf8f3;border:1px solid #bdb7ad;padding:24px}.archivePanel header{display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid #d8d4cd;padding-bottom:16px}.archivePanel header span{font-size:9px;font-weight:900;letter-spacing:.14em;color:#004d73}.archivePanel h2{font:700 30px/1 Georgia,serif;margin:6px 0 0}.archivePanel header button{border:0;background:none;cursor:pointer;font-weight:800}.archiveList article{display:flex;justify-content:space-between;gap:20px;align-items:center;padding:16px 0;border-bottom:1px solid #d8d4cd}.archiveList b{display:block;font:700 18px Georgia,serif}.archiveList small{display:block;margin-top:5px;color:#6d7375}.archiveActions{display:flex;gap:8px}.archiveActions button{border:1px solid #004d73;background:#004d73;color:#fff;padding:7px 10px;font-size:11px;font-weight:800;cursor:pointer}.archiveActions button.delete{background:transparent;border-color:#b7b0a7;color:#6b4a45}.empty{font:16px/1.6 Georgia,serif;color:#555d60;padding:22px 0;margin:0}@media(max-width:960px){.projectbar{height:auto;padding:10px 12px;align-items:flex-start;gap:10px}.projectbarLeft b{display:none}.projectbarActions{flex-wrap:wrap;justify-content:flex-end}}@media(max-width:760px){.archiveList article{align-items:flex-start;flex-direction:column}}`;
