/**
 * @fileoverview Custom hook for smooth scroll-to-top behavior
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license GPL v3
 */

import { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

interface UseScrollToTopOptions {
  /**
   * Whether to automatically scroll to top on route change
   * @default true
   */
  autoScroll?: boolean;

  /**
   * Scroll behavior - 'smooth' for gentle animation, 'auto' for instant
   * @default 'smooth'
   */
  behavior?: ScrollBehavior;

  /**
   * Delay before scrolling (in ms) to allow page content to render
   * @default 100
   */
  delay?: number;

  /**
   * Custom scroll target element selector (defaults to window)
   * @default undefined
   */
  targetSelector?: string;
}

/**
 * Custom hook for smooth scroll-to-top behavior
 *
 * @param options - Configuration options for scroll behavior
 * @returns Object with scrollToTop function and current scroll position
 */
export const useScrollToTop = (options: UseScrollToTopOptions = {}) => {
  const location = useLocation();
  const {
    autoScroll = true,
    behavior = "smooth",
    delay = 100,
    targetSelector,
  } = options;

  /**
   * Smoothly scroll to top of the page or target element
   */
  const scrollToTop = useCallback(
    (customBehavior?: ScrollBehavior, customDelay?: number) => {
      const scrollBehavior = customBehavior || behavior;
      const scrollDelay = customDelay ?? delay;

      setTimeout(() => {
        if (targetSelector) {
          // Scroll to specific element
          const targetElement = document.querySelector(targetSelector);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: scrollBehavior,
              block: "start",
              inline: "nearest",
            });
          }
        } else {
          // Scroll to top of window
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: scrollBehavior,
          });
        }
      }, scrollDelay);
    },
    [behavior, delay, targetSelector],
  );

  /**
   * Scroll to top with instant behavior (no animation)
   */
  const scrollToTopInstant = useCallback(() => {
    scrollToTop("auto", 0);
  }, [scrollToTop]);

  /**
   * Scroll to top with smooth behavior
   */
  const scrollToTopSmooth = useCallback(() => {
    scrollToTop("smooth", delay);
  }, [scrollToTop, delay]);

  // Auto-scroll on route change if enabled
  useEffect(() => {
    if (autoScroll) {
      scrollToTop();
    }
  }, [location.pathname, autoScroll, scrollToTop]);

  return {
    scrollToTop,
    scrollToTopInstant,
    scrollToTopSmooth,
    location,
  };
};
