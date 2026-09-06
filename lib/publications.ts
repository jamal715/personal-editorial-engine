export type Publication={slug:string;title:string;deck?:string;category:string;kicker?:string;content_html:string;visible:boolean;status:string;published_at:string;updated_at?:string};
export const SUPABASE_URL="https://bkbzrrvjpogtrhlkixll.supabase.co";
const PUBLIC_KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"sb_publishable_U0hnx70zmvzUN22opv-Wzw_U4VghXGZ";

const precisionFallback:Publication={
 slug:"precision-recall-text-summarization",
 title:"Precision and Recall in Text Summarization: Why Bigrams Matter",
 deck:"Why unigram precision and recall can reward the wrong summary, and how bigrams preserve more of the sequence.",
 category:"Explainable AI",
 kicker:"NLP · Model evaluation",
 visible:true,
 status:"published",
 published_at:"2026-09-06T13:20:00Z",
 content_html:`<p>When evaluating text summarization models, we often refer to something called the <strong>gold answer</strong> or <strong>gold standard</strong>. This is essentially the <strong>ideal reference summary</strong>, typically written by a human, that serves as a benchmark for assessing machine-generated summaries. A good summarization model should produce outputs that closely match the gold answer regarding meaning, relevance, and structure.</p><p>But how do we measure how well a model’s summary aligns with the gold standard? That’s where <strong>precision</strong> and <strong>recall</strong> come into play.</p><h2>Unigram-Based Evaluation: A Flawed Approach?</h2><p>Let’s start with an example:</p><figure><img alt="Handwritten unigram precision and recall example" src="https://cdn-images-1.medium.com/max/1024/1*YUehuD4m1zs0ogQ6IK3yag.jpeg"/><figcaption>This means our model has perfect precision because all retrieved words were correct, but lower recall because it missed half of the words.</figcaption></figure><p><strong><em>Recall</em></strong> = count of words retrieved by Model X / total count of words in the gold answer</p><p><strong><em>Precision</em></strong> = correctly retrieved words / total retrieved words</p><p>Now, let’s consider another generated summary: <strong>“The cat under was”</strong>.</p><p>Clearly, this doesn’t make sense. But if we calculate recall and precision, recall is 4/6 and precision is 4/4.</p><p>This is misleading. Even though our summary is nonsensical, it gets a higher recall than our first example. That’s because the unigram approach doesn’t consider word order or context, making it a weak metric for evaluating summarization quality.</p><h2>Bigrams: A Smarter Evaluation Approach</h2><p>To improve evaluation, we move to <strong>bigrams</strong>, which consider <strong>pairs of consecutive words</strong> rather than individual words. This helps preserve the sequence and context.</p><figure><img alt="Handwritten bigram evaluation example" src="https://cdn-images-1.medium.com/max/1024/1*9KWw_WyVK7wiPwQxVKTPKw.jpeg"/></figure><p>Notice how the recall is much lower compared to unigram recall, 67% versus 20%, because bigrams <strong>penalize incorrect word order</strong>. This means our model is now getting a fairer evaluation. Rather than being rewarded for just retrieving words, it is tested on whether it preserves <strong>meaningful sequences</strong>.</p><h2>Final Thoughts</h2><p>Evaluating machine-generated summaries isn’t just about counting words. It’s about ensuring the output makes <strong>sense</strong>. Unigram-based precision and recall can sometimes be misleading, but using <strong>bigrams</strong> allows us to <strong>preserve order and meaning</strong> in a much more effective way.</p><p>If you’ve ever worked with text summarization, you’ll know that <strong>metrics don’t always capture fluency</strong>, but as we refine our evaluation techniques, we get closer to summaries that actually sound <strong>human</strong>.</p>`
};

export function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,90)||`article-${Date.now()}`}

export async function publicPublications():Promise<Publication[]>{
 const url=`${SUPABASE_URL}/rest/v1/publications?select=slug,title,deck,category,kicker,content_html,visible,status,published_at,updated_at&visible=eq.true&status=eq.published&order=published_at.desc`;
 try{
  const r=await fetch(url,{headers:{apikey:PUBLIC_KEY},cache:"no-store"});
  if(r.ok){const rows:Publication[]=await r.json();if(!rows.some(x=>x.slug===precisionFallback.slug))rows.unshift(precisionFallback);return rows}
 }catch{}
 return [precisionFallback];
}

export async function publicationBySlug(slug:string):Promise<Publication|null>{
 const url=`${SUPABASE_URL}/rest/v1/publications?select=slug,title,deck,category,kicker,content_html,visible,status,published_at,updated_at&slug=eq.${encodeURIComponent(slug)}&visible=eq.true&status=eq.published&limit=1`;
 try{
  const r=await fetch(url,{headers:{apikey:PUBLIC_KEY},cache:"no-store"});
  if(r.ok){const rows:Publication[]=await r.json();if(rows[0])return rows[0]}
 }catch{}
 return slug===precisionFallback.slug?precisionFallback:null;
}
