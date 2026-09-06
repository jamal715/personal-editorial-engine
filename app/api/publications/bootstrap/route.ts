import{NextRequest,NextResponse}from"next/server";
const DB="https://bkbzrrvjpogtrhlkixll.supabase.co";
const KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"sb_publishable_HIOdjN7r7wL9WABzHjBWnQ_PMQH0HM-";
const BOOT="daeec6e7ce19af911a22c929d8c5f3803c148d4cf81c2a8ef1728c00ae1cdc70";
async function sha(v:string){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v));return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,"0")).join("")}
export async function POST(req:NextRequest){
 const p=process.env.ADMIN_PASSWORD;
 if(!p||req.cookies.get("editor_session")?.value!==await sha(p))return NextResponse.json({ok:false},{status:401});
 const r=await fetch(`${DB}/rest/v1/rpc/admin_publication_bootstrap`,{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify({p_bootstrap:BOOT,p_secret:p}),cache:"no-store"});
 if(!r.ok)return NextResponse.json({ok:false,error:await r.text()},{status:500});
 return NextResponse.json({ok:true})
}
