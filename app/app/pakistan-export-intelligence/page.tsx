import FoodExportExplorer from "../../../components/FoodExportExplorer";

export const metadata={title:"Pakistan Export Intelligence",description:"Interactive chapter-by-chapter export intelligence for Pakistan."};

const styles=`.app-shell{min-height:100vh;background:#f7f1e8}.app-wrap{max-width:1180px;margin:0 auto;padding:28px}.app-head{display:flex;justify-content:space-between;align-items:end;gap:20px;padding:24px 0 12px;border-bottom:1px solid #d8d4cd}.app-head span{font-size:10px;font-weight:800;letter-spacing:.14em;color:#005b7f}.app-head h1{margin:6px 0 0;font:700 34px/1.05 Georgia,serif;color:#202426}.app-head a{font-size:11px;border-bottom:1px solid #202426;padding-bottom:3px}@media(max-width:650px){.app-wrap{padding:18px}.app-head{align-items:start;flex-direction:column}}`;

export default function ExportIntelligenceApp(){return <main className="app-shell"><style>{styles}</style><div className="app-wrap"><header className="app-head"><div><span>INTERACTIVE ANALYTICAL APP</span><h1>Pakistan Export Intelligence</h1></div><a href="/article/pakistan-food-export-intelligence">Read the research note</a></header><FoodExportExplorer/></div></main>}
