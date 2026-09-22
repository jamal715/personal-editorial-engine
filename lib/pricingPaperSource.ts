import fs from "node:fs";
import path from "node:path";

const PARTS=["part-01.html","part-02.html","part-03.html","part-04.html","part-05.html","part-06.html"];

export function pricingPaperHtml(){
 const base=path.join(process.cwd(),"content","price-of-a-promise");
 return PARTS.map(name=>fs.readFileSync(path.join(base,name),"utf8")).join("\n")+"\n";
}
