import { NextRequest, NextResponse } from "next/server";

async function sha256(value:string){
  const data=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest("SHA-256",data);
  return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

export async function middleware(req:NextRequest){
  const password=process.env.ADMIN_PASSWORD;
  const loginUrl=new URL("/admin-login",req.url);

  if(!password){
    loginUrl.searchParams.set("setup","1");
    return NextResponse.redirect(loginUrl);
  }

  const expected=await sha256(password);
  const session=req.cookies.get("editor_session")?.value;
  if(session!==expected){
    loginUrl.searchParams.set("next",req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config={matcher:["/editor/:path*"]};
