/**
 * SidebarNav renders the navigation links for the sidebar.
 * @param pathname Current pathname
 * @param handleMenuItemClick Menu item click handler
 * @param isMobile Whether the sidebar is in mobile mode
 * @param onCloseMenu Optional close menu callback
 */
import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface SidebarNavProps {
  pathname: string;
  handleMenuItemClick: (target: string) => (e: React.MouseEvent) => void;
  isMobile: boolean;
  onCloseMenu?: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = React.memo(
  ({ pathname, handleMenuItemClick }) => (
    <nav
      className="flex flex-col gap-4 font-medium mb-8 mt-8"
      aria-label="Main navigation"
      role="navigation"
    >
      <ul className="flex flex-col gap-4">
        {/* Projects */}
        <li className="relative flex">
          {pathname.startsWith("/projects") && (
            <AnimatePresence>
              <motion.div
                key="selector-projects"
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
              to="/projects"
              aria-current={
                pathname.startsWith("/projects") ? "page" : undefined
              }
              className={`font-bold text-xl ${pathname.startsWith("/projects") ? "text-brand" : ""} hover:text-brand`}
              onClick={handleMenuItemClick("/projects")}
            >
              Projects
            </Link>
            <div className="text-base text-zinc-600 dark:text-zinc-400">
              Selected work & highlights
            </div>
          </div>
        </li>
        {/* About */}
        <li className="relative flex">
          {pathname === "/about" && (
            <AnimatePresence>
              <motion.div
                key="selector-about"
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
              to="/about"
              aria-current={pathname === "/about" ? "page" : undefined}
              className={`font-bold text-xl ${pathname === "/about" ? "text-brand" : ""} hover:text-brand`}
              onClick={handleMenuItemClick("/about")}
            >
              About
            </Link>
            <div className="text-base text-zinc-800 dark:text-zinc-400">
              Designer, builder, product thinker
            </div>
          </div>
        </li>
      </ul>
    </nav>
  ),
);

export default SidebarNav;
