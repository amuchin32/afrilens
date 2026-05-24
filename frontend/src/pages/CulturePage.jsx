import React from "react";
import CategoryPage from "../components/shared/CategoryPage";
import { FaPalette } from "react-icons/fa";

export default function CulturePage() {
  return (
    <CategoryPage
      category="Culture"
      label="Culture"
      description="Arts, music, film, fashion, and the vibrant creative expressions that define African identity and heritage."
      color="#6d1f7c"
      icon={FaPalette}
    />
  );
}
