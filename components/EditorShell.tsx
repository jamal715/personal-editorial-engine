"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import EditorialIntelligenceStudioV5 from "./EditorialIntelligenceStudioV5";

export default function EditorShell(){
  const router=useRouter();
  useEffect(()=>{
    const handler=(event:MouseEvent)=>{
      const el=(event.target as HTMLElement).closest("button");
      if(el?.textContent?.trim()==="06 Visuals"){
        event.preventDefault();
        event.stopPropagation();
        router.push("/editor/visuals");
      }
    };
    document.addEventListener("click",handler,true);
    return()=>document.removeEventListener("click",handler,true);
  },[router]);
  return <EditorialIntelligenceStudioV5/>;
}
