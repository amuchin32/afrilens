import React from "react";
import CategoryPage from "../components/shared/CategoryPage";
import { FaNewspaper } from "react-icons/fa";

export default function NewsPage() {
  return (
    <CategoryPage
      category="News"
      label="News"
      description="Breaking stories, in-depth analysis, and on-the-ground reporting from across Africa and the world — as it happens."
      color="#0047AB"
      icon={FaNewspaper}
    />
  );
}
