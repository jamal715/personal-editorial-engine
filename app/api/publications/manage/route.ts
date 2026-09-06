import{NextRequest,NextResponse}from"next/server";
const DB="https://bkbzrrvjpogtrhlkixll.supabase.co";
const KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"sb_publishable_HIOdjN7r7wL9WABzHjBWnQ_PMQH0HM-";
async function sha(v:string){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v));return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,"0")).join("")}
async function list(p:string){return fetch(`${DB}/rest/v1/rpc/admin_publication_list`,{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify({p_secret:p}),cache:"no-store"})}
export async function GET(req:NextRequest){
 const p=process.env.ADMIN_PASSWORD;
 if(!p||req.cookies.get("editor_session")?.value!==await sha(p))return NextResponse.json({error:"Unauthorized"},{status:401});
 let r=await list(p);
 if(!r.ok&&(await r.clone().text()).includes("unauthorized")){
  const boot=await fetch(new URL("/api/publications/bootstrap",req.url),{method:"POST",headers:{cookie:req.headers.get("cookie")||""},cache:"no-store"});
  if(boot.ok)r=await list(p);
 }
 if(!r.ok)return NextResponse.json({error:await r.text()},{status:500});
 const rows=await r.json();
 return NextResponse.json(rows,{headers:{"Cache-Control":"no-store, max-age=0"}})
}
