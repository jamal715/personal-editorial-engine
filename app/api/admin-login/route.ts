import { NextRequest, NextResponse } from "next/server";

async function sha256(value:string){
  const data=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest("SHA-256",data);
  return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

export async function POST(req:NextRequest){
  const adminPassword=process.env.ADMIN_PASSWORD;
  if(!adminPassword){
    return NextResponse.json({ok:false,error:"Admin password is not configured."},{status:503});
  }

  const form=await req.formData();
  const password=String(form.get("password")||"");
  const next=String(form.get("next")||"/editor");

  if(password!==adminPassword){
    const url=new URL("/admin-login",req.url);
    url.searchParams.set("error","1");
    url.searchParams.set("next",next.startsWith("/")?next:"/editor");
    return NextResponse.redirect(url,303);
  }

  const token=await sha256(adminPassword);
  const response=NextResponse.redirect(new URL(next.startsWith("/")?next:"/editor",req.url),303);
  response.cookies.set("editor_session",token,{httpOnly:true,secure:true,sameSite:"strict",path:"/",maxAge:60*60*12});
  return response;
}
