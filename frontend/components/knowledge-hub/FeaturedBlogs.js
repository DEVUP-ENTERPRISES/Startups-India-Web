import Link from "next/link";

const featuredBlogs = [
  {
    id: 1,
    category: "Funding",
    title: "How We Raised ₹50L Seed Funding in 90 Days",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
    author: "Avinash Sharma",
    readTime: "8 min read",
  },
  {
    id: 2,
    category: "Startup",
    title: "Building Products Users Actually Love",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
    author: "Rohan Verma",
    readTime: "6 min read",
  },
  {
    id: 3,
    category: "Technology",
    title: "AI Tools Every Founder Should Use",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
  },
  {
    id: 4,
    category: "Investor Insights",
    title: "What Investors Look For In Startups",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800",
  },
  {
    id: 5,
    category: "Marketing",
    title: "Growth Strategies That Actually Work",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
  },
];

export default function FeaturedBlogs() {
  return (
    <section className="featuredBlogsSection">
      <div className="featuredBlogsHeader">
        <h2>Featured Blogs</h2>

        <button>View All →</button>
      </div>

      {/* Top Row */}

      <div className="featuredTopGrid">
        {featuredBlogs.slice(0, 2).map((blog) => (
          <Link
            key={blog.id}
            href="/knowledge-hub/test-blog"
            className="featuredLargeCard"
          >
            <img
              src={blog.image}
              alt={blog.title}
            />

            <div className="featuredOverlay">
              <span>{blog.category}</span>

              <h3>{blog.title}</h3>

              <div className="featuredMeta">
                <p>{blog.author}</p>
                <p>{blog.readTime}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Row */}

      <div className="featuredBottomGrid">
        {featuredBlogs.slice(2).map((blog) => (
          <Link
            key={blog.id}
            href="/knowledge-hub/test-blog"
            className="featuredSmallCard"
          >
            <img
              src={blog.image}
              alt={blog.title}
            />

            <div className="featuredSmallContent">
              <span>{blog.category}</span>

              <h4>{blog.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}