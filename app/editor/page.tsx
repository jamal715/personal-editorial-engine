export default function EditorPage() {
  return (
    <main className="editor-shell">
      <header className="editor-top">
        <strong>Personal Editorial Engine</strong>
        <span style={{fontSize:12, opacity:.75}}>Private editor workspace</span>
      </header>

      <div className="editor-grid">
        <aside className="editor-nav">
          <a className="active" href="/editor">Article</a>
          <a href="#">Sources</a>
          <a href="#">Evidence</a>
          <a href="#">Charts</a>
          <a href="#">Style memory</a>
          <a href="#">Publish</a>
          <a href="/" style={{marginTop:30}}>View site ↗</a>
        </aside>

        <section className="editor-main">
          <div className="editor-title">
            <div>
              <div className="kicker">Draft 01</div>
              <h1>Why trusted data matters</h1>
            </div>
            <span className="status-pill">Not published</span>
          </div>

          <div className="editor-tabs">
            <span>Research</span><span className="active">Writing</span><span>Evidence</span><span>Preview</span><span>Distribution</span>
          </div>

          <div className="compare">
            <div className="panel">
              <div className="panel-head">Raw material</div>
              <textarea defaultValue={"Official statistics are extremely important for governments and businesses because they help stakeholders make informed decisions in a rapidly changing environment. High-quality data can unlock better outcomes across the economy and foster trust."} />
            </div>
            <div className="panel">
              <div className="panel-head">Editorial version</div>
              <textarea defaultValue={"Official statistics are easy to ignore when they work. Governments use them to allocate money and adjust payments. Businesses use them to decide where to invest. Their value becomes easier to see when confidence in the numbers starts to weaken."} />
            </div>
          </div>

          <div className="flag">
            <div>
              <strong>Evidence flag</strong>
              <div style={{marginTop:5}}>The draft refers to an economic impact estimate, but the underlying source has not yet been attached. This does not block the draft.</div>
            </div>
            <div className="flag-actions"><button>Attach source</button><button>Keep anyway</button><button>Remove claim</button></div>
          </div>

          <div className="flag" style={{borderLeftColor:'#004d73', background:'#edf6fa'}}>
            <div>
              <strong style={{color:'#004d73'}}>Optional editor question</strong>
              <div style={{marginTop:5}}>Do you have a personal observation, interview, field example or Pakistan comparison that would make this argument more specific?</div>
            </div>
            <div className="flag-actions"><button>Add answer</button><button>Proceed without it</button></div>
          </div>

          <div className="diagnostics">
            <div className="metric"><b>3</b><span>AI-style phrases flagged</span></div>
            <div className="metric"><b>1</b><span>Evidence issue</span></div>
            <div className="metric"><b>0</b><span>Blocking issues</span></div>
            <div className="metric"><b>1,420</b><span>Target words</span></div>
          </div>
        </section>
      </div>
    </main>
  );
}
