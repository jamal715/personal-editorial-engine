import ReaderControls from "../../../components/ReaderControls";

export const metadata={title:"Precision and Recall in Text Summarization: Why Bigrams Matter | Jamal Nasir",description:"Why unigram precision and recall can mislead text summarization evaluation, and why bigrams preserve more of the sequence."};
export const revalidate=3600;

const TITLE="Precision and Recall in Text Summarization: Why Bigrams Matter";
const FEED="https://medium.com/feed/@jamal07";

function cleanMediumHtml(html:string){
  return html
    .replace(/<script[\s\S]*?<\/script>/gi,"")
    .replace(/<style[\s\S]*?<\/style>/gi,"")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi,"")
    .replace(/\sstyle=("[^"]*"|'[^']*')/gi,"")
    .replace(/\sclass=("[^"]*"|'[^']*')/gi,"")
    .replace(/<a /gi,'<a target="_blank" rel="noreferrer" ')
    .replace(/<h3/gi,"<h2").replace(/<\/h3>/gi,"</h2>");
}

async function mediumArticle(){
  try{
    const xml=await fetch(FEED,{next:{revalidate:3600}}).then(r=>{if(!r.ok)throw new Error("feed");return r.text()});
    const items=xml.match(/<item>[\s\S]*?<\/item>/g)||[];
    const item=items.find(x=>x.includes(TITLE));
    if(!item)return null;
    const match=item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i);
    return match?cleanMediumHtml(match[1]):null;
  }catch{return null}
}

const fallback=`<p>When evaluating text summarization models, we often refer to something called the <b>gold answer</b> or <b>gold standard</b>. This is essentially the ideal reference summary, typically written by a human, that serves as a benchmark for assessing machine-generated summaries. A good summarization model should produce outputs that closely match the gold answer regarding meaning, relevance, and structure.</p><p>But how do we measure how well a model’s summary aligns with the gold standard? That’s where <b>precision and recall</b> come into play.</p><h2>Unigram-Based Evaluation: A Flawed Approach?</h2><p>Let’s start with an example.</p><p>This means our model has perfect precision because all retrieved words were correct, but a lower recall because it missed half of the words.</p><p class="formula"><i>Recall</i> = count of words retrieved by Model X / total count of words in the gold answer</p><p class="formula"><i>Precision</i> = correctly retrieved words / total retrieved words</p><p>Now, let’s consider another generated summary: <b>“The cat under was”</b>.</p><p>Clearly, this doesn’t make sense. But if we calculate recall and precision, recall is 4/6 and precision is 4/4.</p><p>This is misleading. Even though our summary is nonsensical, it gets a higher recall than our first example. That’s because the unigram approach doesn’t consider word order or context, making it a weak metric for evaluating summarization quality.</p><h2>Bigrams: A Smarter Evaluation Approach</h2><p>To improve evaluation, we move to bigrams, which consider pairs of consecutive words rather than individual words. This helps preserve the sequence and context.</p><p>Notice how the recall is much lower compared to unigram recall, 67% versus 20%, because bigrams penalize incorrect word order. This means our model is now getting a fairer evaluation.</p><h2>Final Thoughts</h2><p>Evaluating machine-generated summaries isn’t just about counting words. It’s about ensuring the output makes sense.</p>`;

export default async function Page(){
 const remote=await mediumArticle();
 return <main className="tech"><style>{css}</style><ReaderControls/><header><a href="/">Jamal Nasir</a><nav><a href="/">Research</a><a href="/editor">Editor</a></nav></header><article><div className="kicker">EXPLAINABLE AI · NLP</div><h1>{TITLE}</h1><p className="meta">Originally published on Medium · March 13, 2025 · synced from the original article</p><div className="articleContent" dangerouslySetInnerHTML={{__html:remote||fallback}}/></article></main>
}

const css=`*{box-sizing:border-box}.tech{min-height:100vh;background:var(--reader-bg,#f7f1e8);color:var(--reader-text,#343a3d);font-family:Arial,sans-serif}.tech>header{height:64px;border-bottom:1px solid var(--reader-line,#d8d4cd);display:flex;align-items:center;justify-content:space-between;padding:0 28px}.tech>header a{text-decoration:none;color:var(--reader-ink,#202426);font-weight:700}.tech nav{display:flex;gap:22px}.tech nav a{font-size:12px;color:var(--reader-brand,#004d73)}.tech article{width:min(var(--reader-width,760px),calc(100% - 36px));margin:0 auto;padding:68px 0 90px;font:var(--reader-size,19px)/1.72 var(--reader-font,Georgia,serif)}.kicker{font:900 10px Arial,sans-serif;letter-spacing:.14em;color:var(--reader-brand,#004d73)}.tech h1{font:700 clamp(46px,6vw,72px)/.98 var(--reader-font,Georgia,serif);letter-spacing:-.04em;color:var(--reader-ink,#202426);margin:12px 0 16px}.meta{font:11px/1.4 Arial,sans-serif!important;color:var(--reader-muted,#6d7375)!important;border-bottom:1px solid var(--reader-line,#d8d4cd);padding-bottom:22px;margin-bottom:30px!important}.articleContent,.articleContent *{background:transparent!important}.articleContent p{margin:0 0 1.35em}.articleContent h2{font:700 1.7em/1.08 var(--reader-font,Georgia,serif);color:var(--reader-ink,#202426);margin:1.9em 0 .65em}.articleContent img{display:block;width:100%;height:auto;margin:30px auto 8px;border:0}.articleContent figure{margin:34px 0}.articleContent figcaption{margin:8px 0 24px;color:var(--reader-muted,#6d7375);font:italic 13px/1.5 Georgia,serif;text-align:center}.articleContent a{color:var(--reader-brand,#004d73);text-decoration:underline;text-underline-offset:3px}.articleContent .formula,.articleContent blockquote{padding-left:18px;border-left:3px solid var(--reader-brand,#004d73);color:var(--reader-ink,#202426)}@media(max-width:650px){.tech article{padding-top:46px}.tech h1{font-size:46px}}`;
