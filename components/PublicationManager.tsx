"use client";
import{useEffect,useMemo,useState}from"react";
type P={slug:string;title:string;category:string;visible:boolean;status:string;published_at:string};
export default function PublicationManager(){
 const[rows,setRows]=useState<P[]>([]),[msg,setMsg]=useState(""),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 async function load(){setLoading(true);setError("");try{const r=await fetch("/api/publications/manage",{cache:"no-store"});const body=await r.json().catch(()=>null);if(!r.ok)throw new Error(body?.error||`Manager request failed (${r.status})`);setRows(Array.isArray(body)?body:[])}catch(e:any){setRows([]);setError(e?.message||"Could not load publication registry.")}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 async function state(p:P,visible:boolean,status:string){setMsg("");setError("");const r=await fetch("/api/publications",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:p.slug,visible,status})});const body=await r.json().catch(()=>null);if(r.ok){setMsg(visible?"Article restored to the public site.":"Article hidden from the public site and database-backed route.");await load()}else setError(body?.error||"State change failed.")}
 const live=useMemo(()=>rows.filter(p=>p.visible&&p.status==="published").length,[rows]);
 const archived=rows.length-live;
 return <main style={{maxWidth:1100,margin:"46px auto",padding:20,fontFamily:"Arial",color:"#202426"}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"center"}}><a href="/editor">← Editorial Intelligence</a><button onClick={load} disabled={loading}>Refresh registry</button></div>
  <h1 style={{fontFamily:"Georgia",fontSize:48,marginBottom:8}}>Publications</h1>
  <p style={{maxWidth:760,lineHeight:1.55}}>This is the same publication registry used by the public research site. Hiding an article here removes it from the public listing; database-backed article routes also stop resolving while hidden.</p>
  <div style={{display:"flex",gap:24,borderTop:"4px solid #202426",borderBottom:"1px solid #d8d4cd",padding:"14px 0",margin:"24px 0"}}><b>{rows.length} total</b><span>{live} public</span><span>{archived} hidden / archived</span></div>
  {msg&&<p style={{background:"#004d73",color:"white",padding:12}}>{msg}</p>}
  {error&&<p style={{background:"#f3e5df",color:"#7d3528",padding:12,border:"1px solid #d8b8ae"}}><b>Registry sync error:</b> {error}</p>}
  {loading?<p>Loading publication registry…</p>:rows.length===0&&!error?<p>No publication records were returned. This should not happen while the public site has published research.</p>:<div>{rows.map(p=><div key={p.slug} style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) auto",gap:20,padding:"20px 0",borderTop:"1px solid #d8d4cd"}}><div><b style={{fontFamily:"Georgia",fontSize:22}}>{p.title}</b><div style={{fontSize:11,color:"#6d7375",marginTop:6,textTransform:"uppercase",letterSpacing:".06em"}}>{p.category} · {p.visible&&p.status==="published"?"PUBLIC":"HIDDEN / ARCHIVED"}</div><div style={{fontSize:11,color:"#8a8d8e",marginTop:4}}>/article/{p.slug}</div></div><div style={{display:"flex",gap:8,alignItems:"center"}}><a href={`/article/${p.slug}`} target="_blank" rel="noreferrer" style={{fontSize:11}}>Open</a>{p.visible&&p.status==="published"?<button onClick={()=>state(p,false,"archived")} style={{padding:"8px 11px"}}>Hide / archive</button>:<button onClick={()=>state(p,true,"published")} style={{padding:"8px 11px",background:"#004d73",color:"#fff",border:"1px solid #004d73"}}>Restore</button>}</div></div>)}</div>}
 </main>
}
