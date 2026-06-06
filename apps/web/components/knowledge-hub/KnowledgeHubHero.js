"use client";

import { useEffect, useState } from "react";

const cards = [
  {
    category: "Funding",
    title: "How We Raised ₹50L Seed Funding",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
  },
  {
    category: "Startup",
    title: "Building Products Users Love",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
  },
  {
    category: "Technology",
    title: "AI Tools Every Founder Uses",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
  },
];

export default function KnowledgeHubHero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % cards.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="knowledgeHubHero">
      <div className="knowledgeHubHeroContent">
        <div className="knowledgeHubLeft">
          <h1>
            Insights, Stories & Ideas
            <br />
            That Inspire Growth
          </h1>

          <p>
            Explore blogs on startups, funding, technology,
            leadership, innovation and entrepreneurship.
          </p>

          <div className="knowledgeHubTags">
            <span>Startup</span>
            <span>Funding</span>
            <span>Investor Insights</span>
            <span>Technology</span>
            <span>Marketing</span>
          </div>
        </div>

        <div className="knowledgeHubRight">
          <div className="blogStack">
            {cards.map((card, index) => {
              const position =
                (index - active + cards.length) % cards.length;

              return (
                <div
                  key={index}
                  className={`blogStackCard position-${position}`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                  />

                  <div className="blogStackContent">
                    <span>{card.category}</span>
                    <h3>{card.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}