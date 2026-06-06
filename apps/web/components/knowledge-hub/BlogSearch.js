export default function BlogSearch() {
  return (
    <section className="knowledgeSearchSection">
  <div className="knowledgeSearchContainer">

    <h2>Find the Right Insights</h2>

    <p>
      Search through startup stories, funding news,
      investor insights and growth strategies.
    </p>

    {/* Search Row */}
    <div className="searchWrapper">

      <button className="categoryBtn">
        Categories ▼
      </button>

      <input
        type="text"
        placeholder="Search articles, founders, funding news..."
      />

      <button className="searchBtn">
        Search
      </button>

    </div>

    {/* Suggestions */}
    <div className="trendingTopics">
      <span>🔥 Startup</span>
      <span>💰 Funding</span>
      <span>🤖 AI</span>
      <span>📈 Growth</span>
      <span>👨‍💼 Investors</span>
    </div>

    {/* Stats */}
    <div className="searchStats">

      <div>
        <h3>2500+</h3>
        <p>Articles</p>
      </div>

      <div>
        <h3>120+</h3>
        <p>Experts</p>
      </div>

      <div>
        <h3>50+</h3>
        <p>Topics</p>
      </div>

    </div>

  </div>
</section>
  )}