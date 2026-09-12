import { NextRequest, NextResponse } from "next/server";

const DB="https://bkbzrrvjpogtrhlkixll.supabase.co";
const PUBLIC_KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"sb_publishable_HIOdjN7r7wL9WABzHjBWnQ_PMQH0HM-";

async function sha256(value:string){
  const data=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest("SHA-256",data);
  return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

async function publicArticleExists(slug:string){
 try{
  const r=await fetch(`${DB}/rest/v1/rpc/get_public_publication`,{method:"POST",headers:{apikey:PUBLIC_KEY,"Content-Type":"application/json"},body:JSON.stringify({p_slug:slug}),cache:"no-store"});
  if(!r.ok)return null;
  const rows=await r.json();
  return Array.isArray(rows)&&rows.length>0;
 }catch{return null}
}

export async function middleware(req:NextRequest){
 const path=req.nextUrl.pathname;
 if(path.startsWith("/article/")){
  const slug=decodeURIComponent(path.slice("/article/".length).split("/")[0]||"");
  const exists=await publicArticleExists(slug);
  if(exists===false)return new NextResponse("This article is not currently public.",{status:404,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}});
  return NextResponse.next();
 }

 const password=process.env.ADMIN_PASSWORD;
 const loginUrl=new URL("/admin-login",req.url);
 if(!password){loginUrl.searchParams.set("setup","1");return NextResponse.redirect(loginUrl)}
 const expected=await sha256(password),session=req.cookies.get("editor_session")?.value;
 if(session!==expected){loginUrl.searchParams.set("next",req.nextUrl.pathname);return NextResponse.redirect(loginUrl)}
 return NextResponse.next();
}

export const config={matcher:["/editor/:path*","/article/:path*"]};
