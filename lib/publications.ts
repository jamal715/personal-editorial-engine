export type Publication={slug:string;title:string;deck?:string;category:string;kicker?:string;content_html:string;visible:boolean;status:string;published_at:string;updated_at?:string};
export const SUPABASE_URL="https://bkbzrrvjpogtrhlkixll.supabase.co";
const PUBLIC_KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"sb_publishable_HIOdjN7r7wL9WABzHjBWnQ_PMQH0HM-";

const legacy:Publication[]=[
 {slug:"pakistan-power-transition",category:"Power & Energy",kicker:"Pakistan power · Structural analysis",title:"Pakistan built for electricity scarcity. Now the grid is losing demand.",deck:"Excess capacity, distributed solar, fixed costs and transmission are reshaping the country's power crisis.",content_html:"",visible:true,status:"published",published_at:"2026-09-06T00:00:00Z"},
 {slug:"pakistan-food-export-intelligence",category:"Economics",kicker:"Pakistan trade · Interactive",title:"Where Pakistan’s export strength really sits.",deck:"A chapter-by-chapter reading of exporter concentration, product mix and strategically important capabilities.",content_html:"",visible:true,status:"published",published_at:"2026-09-05T00:00:00Z"},
 {slug:"visual-intelligence-benchmark",category:"Tech",kicker:"Visual research · Product benchmark",title:"When the map becomes the argument.",deck:"A compact benchmark for linked maps, derived metrics and visual-first research publishing.",content_html:"",visible:true,status:"published",published_at:"2026-09-04T00:00:00Z"}
];

const precisionFallback:Publication={
 slug:"precision-recall-text-summarization",
 title:"Precision and Recall in Text Summarization: Why Bigrams Matter",
 deck:"Why unigram precision and recall can reward the wrong summary, and how bigrams preserve more of the sequence.",
 category:"Explainable AI",
 kicker:"NLP · Model evaluation",
 visible:true,status:"published",published_at:"2026-09-06T13:20:00Z",
 content_html:`<p>When evaluating text summarization models, we often refer to something called the <strong>gold answer</strong> or <strong>gold standard</strong>. This is essentially the <strong>ideal reference summary</strong>, typically written by a human, that serves as a benchmark for assessing machine-generated summaries. A good summarization model should produce outputs that closely match the gold answer regarding meaning, relevance, and structure.</p><p>But how do we measure how well a model’s summary aligns with the gold standard? That’s where <strong>precision</strong> and <strong>recall</strong> come into play.</p><h2>Unigram-Based Evaluation: A Flawed Approach?</h2><p>Let’s start with an example:</p><figure><img alt="Handwritten unigram precision and recall example" src="https://cdn-images-1.medium.com/max/1024/1*YUehuD4m1zs0ogQ6IK3yag.jpeg"/><figcaption>This means our model has perfect precision because all retrieved words were correct, but lower recall because it missed half of the words.</figcaption></figure><p><strong><em>Recall</em></strong> = count of words retrieved by Model X / total count of words in the gold answer</p><p><strong><em>Precision</em></strong> = correctly retrieved words / total retrieved words</p><p>Now, let’s consider another generated summary: <strong>“The cat under was”</strong>.</p><p>Clearly, this doesn’t make sense. But if we calculate recall and precision, recall is 4/6 and precision is 4/4.</p><p>This is misleading. Even though our summary is nonsensical, it gets a higher recall than our first example. That’s because the unigram approach doesn’t consider word order or context, making it a weak metric for evaluating summarization quality.</p><h2>Bigrams: A Smarter Evaluation Approach</h2><p>To improve evaluation, we move to <strong>bigrams</strong>, which consider <strong>pairs of consecutive words</strong> rather than individual words. This helps preserve the sequence and context.</p><figure><img alt="Handwritten bigram evaluation example" src="https://cdn-images-1.medium.com/max/1024/1*9KWw_WyVK7wiPwQxVKTPKw.jpeg"/></figure><p>Notice how the recall is much lower compared to unigram recall, 67% versus 20%, because bigrams <strong>penalize incorrect word order</strong>. This means our model is now getting a fairer evaluation. Rather than being rewarded for just retrieving words, it is tested on whether it preserves <strong>meaningful sequences</strong>.</p><h2>Final Thoughts</h2><p>Evaluating machine-generated summaries isn’t just about counting words. It’s about ensuring the output makes <strong>sense</strong>. Unigram-based precision and recall can sometimes be misleading, but using <strong>bigrams</strong> allows us to <strong>preserve order and meaning</strong> in a much more effective way.</p><p>If you’ve ever worked with text summarization, you’ll know that <strong>metrics don’t always capture fluency</strong>, but as we refine our evaluation techniques, we get closer to summaries that actually sound <strong>human</strong>.</p>`
};

const allFallback=[precisionFallback,...legacy];
export function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,90)||`article-${Date.now()}`}
function merge(rows:Publication[]){const m=new Map<string,Publication>();for(const p of allFallback)m.set(p.slug,p);for(const p of rows)m.set(p.slug,{...m.get(p.slug),...p});return [...m.values()].sort((a,b)=>new Date(b.published_at).getTime()-new Date(a.published_at).getTime())}

export async function publicPublications():Promise<Publication[]>{
 const url=`${SUPABASE_URL}/rest/v1/rpc/list_public_publications`;
 try{const r=await fetch(url,{method:"POST",headers:{apikey:PUBLIC_KEY,"Content-Type":"application/json"},body:"{}",cache:"no-store"});if(r.ok)return merge(await r.json())}catch{}
 return allFallback;
}

export async function publicationBySlug(slug:string):Promise<Publication|null>{
 const fallback=allFallback.find(x=>x.slug===slug)||null;
 const url=`${SUPABASE_URL}/rest/v1/rpc/get_public_publication`;
 try{const r=await fetch(url,{method:"POST",headers:{apikey:PUBLIC_KEY,"Content-Type":"application/json"},body:JSON.stringify({p_slug:slug}),cache:"no-store"});if(r.ok){const rows:Publication[]=await r.json();if(rows[0])return {...fallback,...rows[0]}}}catch{}
 return fallback;
}
