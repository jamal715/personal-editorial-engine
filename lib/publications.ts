export type Publication={slug:string;title:string;deck?:string;category:string;kicker?:string;content_html:string;visible:boolean;status:string;published_at:string;updated_at?:string};

export const SUPABASE_URL="https://bkbzrrvjpogtrhlkixll.supabase.co";

export function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,90)||`article-${Date.now()}`}

export async function publicPublications():Promise<Publication[]>{
 const url=`${SUPABASE_URL}/rest/v1/publications?select=slug,title,deck,category,kicker,content_html,visible,status,published_at,updated_at&visible=eq.true&status=eq.published&order=published_at.desc`;
 const r=await fetch(url,{headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||""},next:{revalidate:30}});
 if(!r.ok)return [];
 return r.json();
}

export async function publicationBySlug(slug:string):Promise<Publication|null>{
 const url=`${SUPABASE_URL}/rest/v1/publications?select=slug,title,deck,category,kicker,content_html,visible,status,published_at,updated_at&slug=eq.${encodeURIComponent(slug)}&visible=eq.true&status=eq.published&limit=1`;
 const r=await fetch(url,{headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||""},cache:"no-store"});
 if(!r.ok)return null;const rows=await r.json();return rows[0]||null;
}
