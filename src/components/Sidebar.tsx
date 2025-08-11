/**
 * @fileoverview Sidebar navigation component for Hien Le's portfolio
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { trackNavigation, trackDarkModeToggle } from "../utils/analytics";

import Toggle from "./Toggle";

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  menuOpen: boolean;
  onCloseMenu?: () => void;
}

const Sidebar = ({
  darkMode,
  toggleDarkMode,
  menuOpen,
  onCloseMenu,
}: SidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  // Helper to close menu on mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const handleMenuItemClick = (target: string) => (e: React.MouseEvent) => {
    // Track navigation
    trackNavigation(target);

    if (isMobile && onCloseMenu) {
      e.preventDefault();
      onCloseMenu();
      setTimeout(() => {
        navigate(target);
      }, 300); // match slide-out duration
    }
  };

  useEffect(() => {
    // Only lock body scroll on mobile when menu is open
    if (menuOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const mobileVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 },
  };

  const sidebarContent = (
    <div className="flex flex-col h-full pt-26 md:pt-16">
      {/* Separator for mobile - separates MobileHeader brand from sidebar menu */}
      <hr className="w-full border-zinc-200 dark:border-zinc-700 md:hidden" />
      <div className="relative hidden md:block">
        {pathname === "/" && (
          <span
            className="absolute left-0 top-0 h-full w-[4px] rounded bg-brand z-10"
            style={{ transform: "translate3d(0, 0, 0)" }}
          />
        )}
        <div className="pl-8 mb-8">
          <Link
            to="/"
            onClick={handleMenuItemClick("/")}
            className={`font-extrabold text-2xl uppercase ${pathname === "/" ? "text-brand" : ""}`}
          >
            HIEN LE
          </Link>
          <div className="text-base text-zinc-600 dark:text-zinc-400">
            Senior/Lead Product Designer
          </div>
        </div>
      </div>
      <hr className="w-full border-zinc-200 dark:border-zinc-700 mb-8 hidden md:block" />
      <nav className="flex flex-col gap-4 font-medium mb-8 mt-8">
        {/* Projects */}
        <div className="relative flex">
          {pathname.startsWith("/projects") && (
            <AnimatePresence>
              <motion.div
                key="selector-projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 top-0 h-full w-[4px] rounded bg-brand z-10"
                style={{ transform: "translate3d(0, 0, 0)" }}
              />
            </AnimatePresence>
          )}
          <div className="pl-8">
            <Link
              to="/projects"
              className={`font-semibold text-xl ${pathname.startsWith("/projects") ? "text-brand" : ""} hover:text-brand`}
              onClick={handleMenuItemClick("/projects")}
            >
              Projects
            </Link>
            <div className="text-base text-zinc-600 dark:text-zinc-400">
              Selected work & highlights
            </div>
          </div>
        </div>
        {/* Github */}
        <div className="relative flex">
          {pathname === "/github" && (
            <AnimatePresence>
              <motion.div
                key="selector-github"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 top-0 h-full w-[4px] rounded bg-brand z-10"
                style={{ transform: "translate3d(0, 0, 0)" }}
              />
            </AnimatePresence>
          )}
          <div className="pl-8">
            <Link
              to="/github"
              className={`font-bold text-xl ${pathname === "/github" ? "text-brand" : ""} hover:text-brand`}
              onClick={handleMenuItemClick("/github")}
            >
              Github
            </Link>
            <div className="text-base text-zinc-600 dark:text-zinc-400">
              Codebase & tools
            </div>
          </div>
        </div>
        {/* Github */}
        {/* <div className="relative flex">
          {pathname === '/github' && (
            <AnimatePresence>
              <motion.div
                key="selector-github"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 top-0 h-full w-[4px] rounded bg-brand"
              />
            </AnimatePresence>
          )}
          <div className="pl-8">
            <Link
              to="/github"
              className={`font-semibold text-xl ${pathname === '/github' ? 'text-brand' : ''} hover:text-brand`}
              onClick={handleMenuItemClick('/github')}
            >
              Github
            </Link>
            <div className="text-base text-zinc-600 dark:text-zinc-400">Codebase & tools</div>
          </div>
        </div> */}
        {/* About */}
        <div className="relative flex">
          {pathname === "/about" && (
            <AnimatePresence>
              <motion.div
                key="selector-about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 top-0 h-full w-[4px] rounded bg-brand z-10"
                style={{ transform: "translate3d(0, 0, 0)" }}
              />
            </AnimatePresence>
          )}
          <div className="pl-8">
            <Link
              to="/about"
              className={`font-semibold text-xl ${pathname === "/about" ? "text-brand" : ""} hover:text-brand`}
              onClick={handleMenuItemClick("/about")}
            >
              About
            </Link>
            <div className="text-base text-zinc-600 dark:text-zinc-400">
              Designer, builder, product thinker
            </div>
          </div>
        </div>
      </nav>
      <hr className="w-full border-zinc-200 dark:border-zinc-700" />
      <div className="my-4 font-medium pl-8">
        <Toggle
          checked={darkMode}
          onChange={toggleDarkMode}
          labelClassName="text-xl"
        />
      </div>
      <hr className="w-full border-zinc-200 dark:border-zinc-700" />
      <div className="absolute left-8 bottom-20 text-lg font-medium text-zinc-800 dark:text-zinc-400">
        This site is developed
        <br />
        with React.js
      </div>
      <div className="absolute left-8 bottom-8 text-lg font-medium text-zinc-600 dark:text-zinc-400">
        Hien Le © 2025 |{" "}
        <Link
          to="/license"
          className="text-brand hover:underline"
        >
          GPL v3
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden md:block w-72 pt-8 pb-8 fixed top-0 left-0 h-screen overflow-hidden bg-white dark:bg-zinc-900 text-black dark:text-white z-30"
        style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" }}
      >
        <div className="relative">
          {pathname === "/" && (
            <span
              className="absolute left-0 top-0 h-full w-[4px] rounded bg-brand z-10"
              style={{ transform: "translate3d(0, 0, 0)" }}
            />
          )}
          <div className="pl-8 mb-8">
            <Link to="/" className="font-extrabold text-xl text-brand">
              HIEN LE
            </Link>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Senior/Lead Product Designer
            </div>
          </div>
        </div>
        <hr className="w-full border-zinc-200 dark:border-zinc-700 mb-8" />
        <nav className="flex flex-col gap-4 font-medium mb-8 mt-8">
          {/* Projects */}
          <div className="relative flex">
            {pathname.startsWith("/projects") && (
              <AnimatePresence>
                <motion.div
                  key="selector-projects"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-0 h-full w-[4px] rounded bg-brand z-10"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                />
              </AnimatePresence>
            )}
            <div className="pl-8">
              <Link
                to="/projects"
                className={`font-bold ${pathname.startsWith("/projects") ? "text-brand" : ""} hover:text-brand`}
                onClick={handleMenuItemClick("/projects")}
              >
                Projects
              </Link>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Selected work & highlights
              </div>
            </div>
          </div>
          {/* Github */}
          <div className="relative flex">
            {pathname === "/github" && (
              <AnimatePresence>
                <motion.div
                  key="selector-github"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-0 h-full w-[4px] rounded bg-brand z-10"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                />
              </AnimatePresence>
            )}
            <div className="pl-8">
              <Link
                to="/github"
                className={`font-bold ${pathname === "/github" ? "text-brand" : ""} hover:text-brand`}
                onClick={handleMenuItemClick("/github")}
              >
                Github
              </Link>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Codebase & tools
              </div>
            </div>
          </div>
          {/* Github */}
          {/* <div className="relative flex">
            {pathname === '/github' && (
              <AnimatePresence>
                <motion.div
                  key="selector-github"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-0 h-full w-[4px] rounded bg-brand"
                />
              </AnimatePresence>
            )}
            <div className="pl-8">
              <Link
                to="/github"
                className={`font-bold ${pathname === '/github' ? 'text-brand' : ''} hover:text-brand`}
                onClick={handleMenuItemClick('/github')}
              >
                Github
              </Link>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Codebase & tools</div>
            </div>
          </div> */}
          {/* About */}
          <div className="relative flex">
            {pathname === "/about" && (
              <AnimatePresence>
                <motion.div
                  key="selector-about"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-0 h-full w-[4px] rounded bg-brand z-10"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                />
              </AnimatePresence>
            )}
            <div className="pl-8">
              <Link
                to="/about"
                className={`font-bold ${pathname === "/about" ? "text-brand" : ""} hover:text-brand`}
                onClick={handleMenuItemClick("/about")}
              >
                About
              </Link>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Designer, builder, product thinker
              </div>
            </div>
          </div>
        </nav>
        <hr className="w-full border-zinc-200 dark:border-zinc-700" />
        <div className="px-8 my-4 font-medium">
          <Toggle
            checked={darkMode}
            onChange={() => {
              trackDarkModeToggle(!darkMode);
              toggleDarkMode();
            }}
          />
        </div>
        <hr className="w-full border-zinc-200 dark:border-zinc-700" />
        <div className="absolute left-8 bottom-16 text-sm font-medium text-zinc-800 dark:text-zinc-400">
          Developed with React.js
        </div>
        <div className="absolute left-8 bottom-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Hien Le © 2025 |{" "}
          <a
            href="/LICENSE"
            target="_blank"
            className="text-brand hover:underline"
          >
            GPL v3
          </a>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-0 left-0 h-full w-full bg-white dark:bg-zinc-900 text-black dark:text-white z-40"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
