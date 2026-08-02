'use client';

export default function TestimonialsCarousel() {
  return (
    <section className="success-stories-section">
      <div className="container">
        {/* Header */}
        <div className="stories-header">
          <h2 className="stories-title">
            Real Success Stories from Startups<br/>Building the Future of Innovation
          </h2>
          <p className="stories-subtitle">
            Discover how our incubation program has empowered hundreds of entrepreneurs to transform their ideas into thriving businesses, with proven results in funding, growth, and market success across diverse industries.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="testimonials-bento-grid">
          {/* Large Card - 8X Conversion */}
          <div className="testimonial-card large-card">
            <div className="card-stat">8X</div>
            <div className="card-stat-label">Increase in conversion rate</div>
            <div className="quote-icon">❝</div>
            <p className="card-text">
              "We needed a modern, high-converting website, and the Bravito team delivered beyond expectations. Their design and SEO expertise helped us increase conversion rate by 800% in just two weeks. Highly recommend!"
            </p>
            <div className="card-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <div className="author-name">David Callahan</div>
                <div className="author-role">Marketing Director, Spotify</div>
              </div>
              <div className="company-logo">S</div>
            </div>
          </div>

          {/* Top Right Card - 2X Lead Generation */}
          <div className="testimonial-card medium-card">
            <div className="card-stat">2X</div>
            <div className="card-stat-label">Increase in lead generation</div>
            <div className="quote-icon">❝</div>
            <p className="card-text">
              "From branding to website design, every detail was meticulously handled. The team's expertise helped us launch faster, and the results have been phenomenal!"
            </p>
            <div className="card-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <div className="author-name">Sarah Mitchel</div>
                <div className="author-role">Marketing Director, Google</div>
              </div>
              <div className="company-logo">G</div>
            </div>
          </div>

          {/* Middle Right Card */}
          <div className="testimonial-card small-card">
            <div className="quote-icon">❝</div>
            <p className="card-text">
              "Their animation work took our product videos to the next level. The team truly understands user experience and storytelling."
            </p>
            <div className="card-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <div className="author-name">Tom Becker</div>
                <div className="author-role">Founder, PulseCore</div>
              </div>
            </div>
          </div>

          {/* Bottom Right Card - Dark */}
          <div className="testimonial-card small-card dark-card">
            <div className="quote-icon">❝</div>
            <p className="card-text">
              "The team nailed our MVP design with a fast turnaround and incredible attention to detail. The final product felt polished and professional."
            </p>
            <div className="card-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <div className="author-name">Sarah Mitchel</div>
                <div className="author-role">Marketing Director, Google</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
