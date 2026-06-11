import React from "react";
import CategoryPage from "../components/shared/CategoryPage";
import { FaFutbol } from "react-icons/fa";

export default function SportsPage() {
  return (
    <CategoryPage
      category="Sports"
      label="Sports"
      description="Latest sports news, match results, scores and analysis from across Africa and the world."
      color="#c0392b"
      icon={FaFutbol}
    />
  );
}
