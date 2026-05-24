import React from "react";
import CategoryPage from "../components/shared/CategoryPage";
import { FaFutbol } from "react-icons/fa";

export default function SportPage() {
  return (
    <CategoryPage
      category="Sport"
      label="Sport"
      description="Latest sports news, match results, and analysis from across Africa and the world."
      color="#c0392b"
      icon={FaFutbol}
    />
  );
}
