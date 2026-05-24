import React from "react";
import CategoryPage from "../components/shared/CategoryPage";
import { FaMicrochip } from "react-icons/fa";

export default function TechPage() {
  return (
    <CategoryPage
      category="Tech"
      label="Technology"
      description="Innovation, startups, digital transformation, and the tech revolution redefining Africa's future."
      color="#1a3a6e"
      icon={FaMicrochip}
    />
  );
}
