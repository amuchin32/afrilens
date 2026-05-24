import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import BusinessPage from "./pages/BusinessPage";
import TechPage from "./pages/TechPage";
import CulturePage from "./pages/CulturePage";
import VideosPage from "./pages/VideosPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import SportPage from "./pages/SportPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ArticlePage from "./pages/ArticlePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./styles/main.css";
import "./styles/navbar.css";
import "./styles/article.css";
import "./styles/footer.css";
import "./styles/responsive.css";
import "./styles/pages.css";
import "./styles/CategoryPage.css";
import "./styles/admin.css";
import "./styles/admin-extra.css";
import "./styles/admin-components.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/business" element={<BusinessPage />} />
            <Route path="/tech" element={<TechPage />} />
            <Route path="/culture" element={<CulturePage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/sport" element={<SportPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/news/:slug" element={<ArticlePage />} />
            <Route path="/business/:slug" element={<ArticlePage />} />
            <Route path="/tech/:slug" element={<ArticlePage />} />
            <Route path="/culture/:slug" element={<ArticlePage />} />
            <Route path="/opportunities/:slug" element={<ArticlePage />} />
            <Route path="/sport/:slug" element={<ArticlePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
export default App;
