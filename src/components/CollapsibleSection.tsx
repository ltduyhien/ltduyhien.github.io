import React, { useState, useId, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CollapsibleSectionProps {
  title: string;
  subtext?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  extraBottomPadding?: boolean;
  expandLock?: boolean;
}

const CollapsibleSection = ({
  title,
  subtext,
  children,
  isOpen: controlledOpen,
  onToggle,
  extraBottomPadding = false,
  expandLock = false,
}: CollapsibleSectionProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = expandLock
    ? true
    : controlledOpen !== undefined
      ? controlledOpen
      : internalOpen;
  const sectionId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const updateHeight = () => setContentHeight(el.scrollHeight);
    if (isOpen) updateHeight();
    const observer = new window.ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isOpen, children]);

  const handleToggle = () => {
    if (expandLock) return;
    if (onToggle) {
      onToggle(!isOpen);
    } else {
      setInternalOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (expandLock) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700">
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`w-full flex justify-between items-center py-4 text-left transition-colors duration-200 ${
          expandLock ? "" : "hover:bg-[var(--color-hover-bg)]"
        }`}
        aria-expanded={isOpen}
        aria-controls={sectionId}
        type="button"
        role="button"
        disabled={expandLock}
      >
        <div className="flex flex-col flex-1">
          <h2
            className="text-lg font-semibold mb-0 text-zinc-900 dark:text-zinc-100"
            style={{ fontSize: "1.0625rem" }}
          >
            {title}
          </h2>
          {subtext && (
            <span className="text-sm text-zinc-800 dark:text-zinc-300 font-normal mt-1">
              {subtext}
            </span>
          )}
        </div>
        {!expandLock && (
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="rgb(var(--color-brand))"
              style={{ color: "rgb(var(--color-brand))" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.div>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={sectionId}
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: contentHeight }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div ref={contentRef} className={`pt-4 pb-8`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection;
