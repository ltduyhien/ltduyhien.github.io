/**
 * @fileoverview Main application component for Hien Le's portfolio
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { trackPageView, testCustomDimensions } from './utils/analytics';

import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import ProjectSingle from './pages/ProjectSingle';
import Github from './pages/Github';
import NotFound from './pages/NotFound';
import SecurityDashboard from './components/SecurityDashboard';
import WatermarkingDashboard from './components/WatermarkingDashboard';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileHeader, setShowMobileHeader] = useState(true);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close menu when resizing to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    function handleScroll() {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        setShowMobileHeader(true);
        return;
      }
      if (window.scrollY <= 0) {
        setShowMobileHeader(true);
      } else if (window.scrollY > lastScrollY) {
        setShowMobileHeader(false); // scrolling down
      } else {
        setShowMobileHeader(true); // scrolling up
      }
      lastScrollY = window.scrollY;
    }
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen text-black dark:text-white transition-colors duration-300 ease-in-out">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <MobileHeader
          menuOpen={menuOpen}
          toggleMenu={() => setMenuOpen(!menuOpen)}
          show={showMobileHeader}
        />
        <Sidebar
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          menuOpen={menuOpen}
          onCloseMenu={() => setMenuOpen(false)}
        />
        <ContentWithFade />
        <SecurityDashboard />
        <WatermarkingDashboard />
      </Router>
    </div>
  );
};

function ContentWithFade() {
  const location = useLocation();
  
  // Track page views for Google Analytics
  useEffect(() => {
    console.log('Route changed to:', location.pathname);
    trackPageView(location.pathname);
    // Test custom dimensions on first load
    if (location.pathname === '/') {
      testCustomDimensions();
    }
  }, [location.pathname]);
  
  // Special handling for 404 page
  if (location.pathname === '/404' || location.pathname === '*') {
    return <NotFound />;
  }
  
  return (
    <div className="md:ml-72 min-h-screen pt-8 md:pt-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectSingle />} />
            <Route path="/github" element={<Github />} />
            {/* <Route path="/github" element={<Github />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
