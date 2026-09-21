import * as XLSX from "xlsx";
import {ISMO_2025} from "../../../lib/ismo-model";

export const dynamic="force-static";
export async function GET(){
 const rows:any[][]=[["ISMO Product Structuring | reproducibility workbook"],[],["Inputs"],["Book size (MW)",400],["Fixed price K (PKR/kWh)",16.3503],["Pool loading",0.67],["Annual fund return",0.11],["Price multiplier",1],[],["Month","Days","Hour","System demand (MW)","Marginal cost (PKR/kWh)"]];
 ISMO_2025.forEach(m=>m.demand.forEach((d,h)=>rows.push([m.month,m.days,h,d,m.price[h]])));
 const wb=XLSX.utils.book_new(),ws=XLSX.utils.aoa_to_sheet(rows);
 ws["!cols"]=[{wch:16},{wch:12},{wch:8},{wch:22},{wch:26}];
 XLSX.utils.book_append_sheet(wb,ws,"2025 hourly data");
 const guide=XLSX.utils.aoa_to_sheet([
  ["Model logic"],["This workbook is the downloadable data and parameter record behind the browser model."],[],
  ["Operation","Definition"],["Buyer electricity","Scale the selected load shape to the chosen average MW."],["Hourly payout","units × MAX(market price × scenario − K, 0)"],["Starting pool","NPV of unshocked 2025 monthly payouts at the monthly fund return × (1 + loading)"],["Monthly pool","Opening balance + monthly interest − pool-paid claims"],["NCGCL claim","MAX(monthly payout − opening pool − interest, 0)"],[],
  ["Base case checks"],["Buyer contribution (PKR bn)",13.84],["Contribution (PKR/kWh)",3.95],["All-in price (PKR/kWh)",20.3010],["NCGCL exposure (PKR bn)",0],["Closing pool (PKR bn)",6.20],[],
  ["25% price stress"],["NCGCL exposure (PKR bn)",4.75],["Closing pool (PKR bn)",0]
 ]);
 guide["!cols"]=[{wch:34},{wch:90}];XLSX.utils.book_append_sheet(wb,guide,"Model guide");
 const data=XLSX.write(wb,{type:"buffer",bookType:"xlsx"});
 return new Response(data,{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":'attachment; filename="ISMO-Product-Structuring.xlsx"',"Cache-Control":"public, max-age=3600"}});
}
