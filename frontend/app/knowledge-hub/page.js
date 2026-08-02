import KnowledgeHubHero from "../../components/knowledge-hub/KnowledgeHubHero";
import FeaturedBlogs from "../../components/knowledge-hub/FeaturedBlogs";
import BlogSearch from "../../components/knowledge-hub/BlogSearch";
import PopularCategories from "../../components/knowledge-hub/PopularCategories";
import LatestArticles from "../../components/knowledge-hub/LatestArticles";

import "../../styles/knowledge-hub.css";

export default function KnowledgeHubPage() {
  return (
    <div className="knowledgeHubPage">
      <KnowledgeHubHero />
      <FeaturedBlogs />
      <BlogSearch />
      <PopularCategories />
      <LatestArticles />
    </div>
  );
}