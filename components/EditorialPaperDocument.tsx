"use client";
import {useEffect,useRef} from "react";

export default function EditorialPaperDocument({html}:{html:string}){
 const hostRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const host=hostRef.current;if(!host)return;
  const root=host.shadowRoot||host.attachShadow({mode:"open"});
  const parsed=new DOMParser().parseFromString(html,"text/html");
  parsed.querySelectorAll("script").forEach(x=>x.remove());
  const sourceCss=Array.from(parsed.head.querySelectorAll("style")).map(x=>x.textContent||"").join("\n")
   .replace(/:root/g,":host")
   .replace(/\bhtml\s*\{/g,":host{")
   .replace(/\bbody\s*\{/g,".paperDocument{");
  root.innerHTML="";
  parsed.head.querySelectorAll('link[rel="stylesheet"],link[rel="preconnect"]').forEach(x=>root.appendChild(x.cloneNode(true)));
  const style=document.createElement("style");
  style.textContent=sourceCss+"\n"+
   ':host{--paper:var(--reader-bg,#FFF1E5);--ink:var(--reader-ink,#1A1A18);--ink2:var(--reader-muted,#56504A);--muted:var(--reader-muted,#857C72);--rule:var(--reader-line,#E4D6C4);--rule2:var(--reader-line,#C9B8A3);--serif:var(--reader-font,"Source Serif 4",Georgia,"Times New Roman",serif);display:block;background:var(--paper);color:var(--ink)}'+
   '.paperDocument{font-size:var(--reader-size,19px)!important;min-height:100vh}.wrap{max-width:var(--reader-width,720px)!important}'+
   '@media print{.paperDocument{background:#fff!important}.wrap{max-width:100%!important}}';
  root.appendChild(style);
  const shell=document.createElement("div");shell.className="paperDocument";shell.innerHTML=parsed.body.innerHTML;root.appendChild(shell);
  const tt=root.querySelector("#tt") as HTMLElement|null;
  const getBar=(e:Event)=>{const t=e.target as Element|null;return t&&typeof t.closest==="function"?t.closest(".bar") as Element|null:null};
  const over=(e:Event)=>{const bar=getBar(e);if(!bar||!tt)return;tt.innerHTML="<b>"+(bar.getAttribute("data-l")||"")+"</b>"+(bar.getAttribute("data-v")||"");tt.style.opacity="1"};
  const move=(e:Event)=>{if(!tt||tt.style.opacity!=="1")return;const m=e as MouseEvent;let x=m.clientX+14,y=m.clientY-12;const rect=tt.getBoundingClientRect();if(x+rect.width>window.innerWidth-8)x=m.clientX-rect.width-14;if(y<8)y=8;tt.style.left=x+"px";tt.style.top=y+"px"};
  const out=(e:Event)=>{if(getBar(e)&&tt)tt.style.opacity="0"};
  root.addEventListener("mouseover",over);root.addEventListener("mousemove",move);root.addEventListener("mouseout",out);
  return()=>{root.removeEventListener("mouseover",over);root.removeEventListener("mousemove",move);root.removeEventListener("mouseout",out)};
 },[html]);
 return <div ref={hostRef}/>;
}
