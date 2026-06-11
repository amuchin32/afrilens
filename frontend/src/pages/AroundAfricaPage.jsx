import React from "react";
import CategoryPage from "../components/shared/CategoryPage";
import { FaGlobe } from "react-icons/fa";

export default function AroundAfricaPage() {
  return (
    <CategoryPage
      category="Around Africa"
      label="Around Africa"
      description="Stories, trends, and developments from across the African continent — told from the inside out."
      color="#1a5276"
      icon={FaGlobe}
    />
  );
}
