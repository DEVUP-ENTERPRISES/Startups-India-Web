import "../../../styles/knowledge-hub.css";

export default function BlogDetailPage() {
  return (
    <div className="blogDetailsPage">

      <div className="blogMainContent">

        <section className="blogHero">
          <div className="blogCategory">
            Funding
          </div>

          <h1>
            How We Raised ₹50L Seed Funding
            In 90 Days
          </h1>

          <div className="blogMeta">
            <span>June 2026</span>
            <span>•</span>
            <span>8 min read</span>
            <span>•</span>
            <span>StartupsIndia Editorial Team</span>
          </div>
        </section>

        <section className="blogFeaturedImage">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400"
            alt=""
          />
        </section>

        <section className="blogContent">

          <p>
            Raising startup funding is one of the biggest
            challenges founders face...
          </p>

          <h2>Understanding Investor Expectations</h2>

          <p>
            Investors are looking for traction,
            market validation and growth potential.
          </p>

          <blockquote>
            The best time to raise money is before
            you actually need it.
          </blockquote>

          <h2>Building Investor Confidence</h2>

          <p>
            Founders must demonstrate strong execution
            and a scalable business model.
          </p>

        </section>

      </div>

      <aside className="blogSidebar">

        <div className="sidebarCard">
          <h3>Author</h3>

          <img
            src="https://i.pravatar.cc/150?img=12"
            alt=""
            className="authorAvatar"
          />

          <h4>Avinash Sharma</h4>

          <p>
            Startup ecosystem writer and growth strategist.
          </p>
        </div>

        <div className="sidebarCard">
          <h3>Related Articles</h3>

          <ul>
            <li>Building Products Users Love</li>
            <li>AI Tools Every Founder Uses</li>
            <li>Growth Strategies That Work</li>
          </ul>
        </div>

        <div className="sidebarCard">
          <h3>Tags</h3>

          <div className="blogTags">
            <span>Funding</span>
            <span>Startup</span>
            <span>Investors</span>
            <span>Growth</span>
          </div>
        </div>

      </aside>

    </div>
  );
}