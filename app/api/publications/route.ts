import {NextRequest,NextResponse} from "next/server";

const DB="https://bkbzrrvjpogtrhlkixll.supabase.co";
async function sha256(value:string){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,"0")).join("")}
async function authorized(req:NextRequest){const p=process.env.ADMIN_PASSWORD;if(!p)return false;return req.cookies.get("editor_session")?.value===await sha256(p)}
function slugify(v:string){return v.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,90)||`article-${Date.now()}`}

export async function POST(req:NextRequest){
 if(!await authorized(req))return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
 const password=process.env.ADMIN_PASSWORD||"";const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"";
 const b=await req.json();const slug=slugify(String(b.slug||b.title||""));
 const payload={p_secret:password,p_slug:slug,p_title:String(b.title||"Untitled article"),p_deck:String(b.deck||""),p_category:String(b.category||"Research"),p_kicker:String(b.kicker||""),p_content_html:String(b.content_html||""),p_visible:b.visible!==false,p_status:String(b.status||"published"),p_published_at:b.published_at||new Date().toISOString()};
 const r=await fetch(`${DB}/rest/v1/rpc/admin_publication_write`,{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify(payload)});
 if(!r.ok)return NextResponse.json({ok:false,error:await r.text()},{status:500});
 return NextResponse.json({ok:true,slug,publication:await r.json()});
}

export async function PATCH(req:NextRequest){
 if(!await authorized(req))return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
 const password=process.env.ADMIN_PASSWORD||"";const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"";const b=await req.json();
 const r=await fetch(`${DB}/rest/v1/rpc/admin_publication_set_state`,{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({p_secret:password,p_slug:String(b.slug||""),p_visible:Boolean(b.visible),p_status:String(b.status||"archived")})});
 if(!r.ok)return NextResponse.json({ok:false,error:await r.text()},{status:500});return NextResponse.json({ok:true,publication:await r.json()});
}
