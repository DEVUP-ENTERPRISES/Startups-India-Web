export default function PopularCategories() {
  const categories = [
    {
      title: "Startup",
      count: "450+ Articles",
      icon: "🚀",
    },
    {
      title: "Funding",
      count: "320+ Articles",
      icon: "💰",
    },
    {
      title: "Technology",
      count: "210+ Articles",
      icon: "🤖",
    },
    {
      title: "Investors",
      count: "150+ Articles",
      icon: "👨‍💼",
    },
    {
      title: "Marketing",
      count: "180+ Articles",
      icon: "📈",
    },
    {
      title: "Growth",
      count: "120+ Articles",
      icon: "🌍",
    },
  ];

  return (
    <section className="popularCategoriesSection">
      <div className="popularCategoriesContainer">

        <div className="sectionHeader">
          <span className="sectionTag">
            Explore Topics
          </span>

          <h2>Popular Categories</h2>

          <p>
            Discover expert insights, startup stories,
            funding news and growth strategies across
            multiple business categories.
          </p>
        </div>

        <div className="categoriesGrid">
          {categories.map((category, index) => (
            <div
              key={index}
              className="categoryCard"
            >
              <div className="categoryIcon">
                {category.icon}
              </div>

              <h3>{category.title}</h3>

              <span>{category.count}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}