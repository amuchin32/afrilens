import React from 'react';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import BreakingNewsTicker from '../common/BreakingNewsTicker';
const Layout = ({ children }) => (
  <div className="page-wrapper" style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
    <TopBar />
    <Navbar />
    <BreakingNewsTicker />
    <main className="main-content" style={{ flex:1 }}>
      {children}
    </main>
    <Footer />
  </div>
);
export default Layout;
