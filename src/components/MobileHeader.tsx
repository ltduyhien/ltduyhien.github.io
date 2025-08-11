/**
 * @fileoverview Mobile header component for Hien Le's portfolio
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import { trackLogoClick, trackMobileMenuToggle } from "../utils/analytics";

interface MobileHeaderProps {
  menuOpen: boolean;
  toggleMenu: () => void;
  show: boolean;
}

const MobileHeader = ({ menuOpen, toggleMenu, show }: MobileHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackLogoClick();
    if (menuOpen) {
      toggleMenu();
      setTimeout(() => {
        navigate("/");
      }, 300); // match slide-out duration
    } else {
      navigate("/");
    }
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={`md:hidden flex justify-between items-center pr-8 py-6 z-50 fixed top-0 left-0 w-full text-black dark:text-white ${menuOpen ? "bg-transparent" : "bg-[#F5F5F5] dark:bg-zinc-850"}${scrolled ? " shadow-md" : ""}`}
        >
          <div className="relative flex items-center">
            {location.pathname === "/" && (
              <span className="absolute left-0 top-0 h-full w-[4px] rounded bg-brand" />
            )}
            <div style={{ paddingLeft: "2rem" }}>
              <a
                href="/"
                onClick={handleLogoClick}
                className="font-extrabold text-2xl uppercase text-brand"
              >
                HIEN LE
              </a>
              <div className="text-base text-zinc-800 dark:text-zinc-100">
                Senior/Lead Product Designer
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              trackMobileMenuToggle(!menuOpen);
              toggleMenu();
            }}
            className="p-3"
          >
            {menuOpen ? (
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-brand"
              >
                <rect
                  x="6.20068"
                  y="3.00012"
                  width="28"
                  height="4"
                  transform="rotate(45 6.20068 3.00012)"
                  fill="currentColor"
                />
                <rect
                  x="3"
                  y="22.7991"
                  width="28"
                  height="4"
                  transform="rotate(-45 3 22.7991)"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-brand"
              >
                <rect y="2" width="26" height="4" fill="currentColor" />
                <rect y="12" width="26" height="4" fill="currentColor" />
                <rect y="22" width="26" height="4" fill="currentColor" />
              </svg>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileHeader;
