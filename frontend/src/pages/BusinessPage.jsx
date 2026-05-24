import React from "react";
import CategoryPage from "../components/shared/CategoryPage";
import { FaBriefcase } from "react-icons/fa";

export default function BusinessPage() {
  return (
    <CategoryPage
      category="Business"
      label="Business"
      description="Markets, economy, entrepreneurship and investment stories shaping Africa's financial future."
      color="#1a5276"
      icon={FaBriefcase}
    />
  );
}
