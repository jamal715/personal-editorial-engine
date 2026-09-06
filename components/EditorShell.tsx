"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import EditorialIntelligenceStudioV5 from "./EditorialIntelligenceStudioV5";

export default function EditorShell(){
  const router=useRouter();
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
  return <EditorialIntelligenceStudioV5/>;
}
