export default function LatestArticles() {

  const articles = [
    {
      category: "Funding",
      title: "How We Raised ₹50L Seed Funding",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      readTime: "5 min read",
      date: "June 2026"
    },
    {
      category: "Startup",
      title: "Building Products Users Actually Love",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
      readTime: "7 min read",
      date: "June 2026"
    },
    {
      category: "Technology",
      title: "AI Tools Every Founder Should Use",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      readTime: "4 min read",
      date: "June 2026"
    },
    {
      category: "Investors",
      title: "What Investors Look For In Startups",
      image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800",
      readTime: "6 min read",
      date: "June 2026"
    },
    {
      category: "Marketing",
      title: "Growth Strategies That Actually Work",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      readTime: "8 min read",
      date: "June 2026"
    },
    {
      category: "Startup",
      title: "From Idea To Product Launch",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
      readTime: "5 min read",
      date: "June 2026"
    }
  ];

  return (
    <section className="latestArticlesSection">

      <div className="latestArticlesContainer">

        <div className="latestArticlesHeader">
          <div>
            <span className="sectionTag">
              Latest Insights
            </span>

            <h2>Latest Articles</h2>
          </div>

          <button className="viewAllBtn">
            View All →
          </button>
        </div>

        <div className="articleFilters">
          <button className="active">All</button>
          <button>Startup</button>
          <button>Funding</button>
          <button>Technology</button>
          <button>Investors</button>
          <button>Marketing</button>
        </div>

        <div className="articlesGrid">

          {articles.map((article, index) => (
            <div
              key={index}
              className="articleCard"
            >

              <img
                src={article.image}
                alt={article.title}
              />

              <div className="articleContent">

                <span className="articleCategory">
                  {article.category}
                </span>

                <h3>{article.title}</h3>

                <div className="articleMeta">
                  <span>{article.readTime}</span>
                  <span>{article.date}</span>
                </div>

              </div>

            </div>
          ))}

        </div>

        <div className="loadMoreWrapper">
          <button className="loadMoreBtn">
            Load More Articles
          </button>
        </div>

      </div>

    </section>
  );
}