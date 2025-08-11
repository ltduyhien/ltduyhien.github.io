import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

import {
  trackPageEngagement,
  trackPageTimeSpent,
  trackPageInteraction,
  setUserProperties,
} from "../utils/analytics";
import {
  detectUserType,
  detectVisitFrequency,
  detectDeviceType,
  detectTimeOfDay,
  detectDayOfWeek,
  detectGeographicInfo,
  detectInterests,
} from "../utils/userDetection";

interface UsePageEngagementOptions {
  trackInteractions?: boolean;
  trackScroll?: boolean;
  trackSections?: boolean;
}

export const usePageEngagement = (options: UsePageEngagementOptions = {}) => {
  const location = useLocation();
  const [startTime] = useState<number>(Date.now());
  const [interactionCount, setInteractionCount] = useState<number>(0);
  const [scrollDepth, setScrollDepth] = useState<number>(0);
  const [sectionsViewed, setSectionsViewed] = useState<number>(0);
  const [pagesVisited, setPagesVisited] = useState<string[]>([]);
  const [projectsClicked, setProjectsClicked] = useState<string[]>([]);
  const isTracking = useRef<boolean>(true);

  const {
    trackInteractions = true,
    trackScroll = true,
    trackSections = false,
  } = options;

  // Track page interactions
  const trackInteraction = (
    interactionType: string,
    details?: Record<string, unknown>,
  ) => {
    if (trackInteractions && isTracking.current) {
      setInteractionCount((prev) => prev + 1);
      trackPageInteraction(location.pathname, interactionType, details);

      // Track project clicks for user type detection
      if (interactionType === "project_card_click" && details?.project_slug) {
        setProjectsClicked((prev) => [...prev, details.project_slug]);
      }
    }
  };

  // Track section views
  const trackSectionView = (sectionName: string) => {
    if (trackSections && isTracking.current) {
      setSectionsViewed((prev) => prev + 1);
      trackPageInteraction(location.pathname, "section_view", {
        section: sectionName,
      });
    }
  };

  // Scroll depth tracking
  useEffect(() => {
    if (!trackScroll) return;

    const handleScroll = () => {
      if (!isTracking.current) return;

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      setScrollDepth(Math.max(scrollDepth, scrollPercent));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDepth, trackScroll]);

  // Track final engagement when component unmounts or location changes
  useEffect(() => {
    return () => {
      if (isTracking.current) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        // Only track if they spent at least 5 seconds on the page
        if (timeSpent >= 5) {
          trackPageEngagement(location.pathname, {
            timeSpent,
            scrollDepth,
            interactions: interactionCount,
            sectionsViewed,
          });

          trackPageTimeSpent(location.pathname, timeSpent);

          // Set user properties based on behavior
          const userType = detectUserType({
            pagesVisited: [...pagesVisited, location.pathname],
            projectsClicked,
            timeSpent,
            interactions: interactionCount,
            scrollDepth,
          });

          setUserProperties({
            user_type: userType,
            visit_frequency: detectVisitFrequency(),
            device_type: detectDeviceType(),
            time_of_day: detectTimeOfDay(),
            day_of_week: detectDayOfWeek(),
            interaction_depth: sectionsViewed,
          });
        }

        isTracking.current = false;
      }
    };
  }, [
    location.pathname,
    startTime,
    scrollDepth,
    interactionCount,
    sectionsViewed,
    pagesVisited,
    projectsClicked,
  ]);

  // Reset tracking when location changes
  useEffect(() => {
    setInteractionCount(0);
    setScrollDepth(0);
    setSectionsViewed(0);
    setPagesVisited((prev) => [...prev, location.pathname]);
    isTracking.current = true;
  }, [location.pathname]);

  return {
    trackInteraction,
    trackSectionView,
    interactionCount,
    scrollDepth,
    sectionsViewed,
  };
};
