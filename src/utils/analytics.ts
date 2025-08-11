import { ANALYTICS_CONFIG } from "./config";

// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
  }
}

export const trackPageView = (path: string, title?: string) => {
  // Only track if analytics is enabled and configured
  if (!ANALYTICS_CONFIG.enabled || !ANALYTICS_CONFIG.measurementId) {
    return;
  }

  if (typeof window !== "undefined" && window.gtag) {
    console.log("Tracking page view:", path, title || document.title);
    console.log("Full URL:", window.location.origin + path);

    // For SPAs, use config with page_path to track individual page views
    // This is the recommended method for GA4 SPAs
    window.gtag("config", ANALYTICS_CONFIG.measurementId, {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.origin + path,
    });
  }
};

export const trackEvent = (
  action: string,
  category: string,
  label?: string | object,
  value?: number,
) => {
  if (typeof window !== "undefined" && window.gtag) {
    if (typeof label === "object") {
      window.gtag("event", action, {
        event_category: category,
        ...label,
      });
    } else {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  }
};

// Specific tracking functions for portfolio
export const trackProjectView = (projectSlug: string) => {
  trackEvent("project_view", "engagement", projectSlug);
};

export const trackCVDownload = () => {
  trackEvent("cv_download", "engagement", "cv_download");
};

export const trackGitHubClick = () => {
  trackEvent("github_click", "engagement", "github_link");
};

export const trackContactClick = () => {
  trackEvent("contact_click", "engagement", "contact_link");
};

// Navigation tracking
export const trackNavigation = (page: string) => {
  trackEvent("navigation", "engagement", page);
};

// UI interaction tracking
export const trackCollapseAll = (page: string) => {
  trackEvent("collapse_all", "ui_interaction", page);
};

export const trackSectionToggle = (
  section: string,
  isOpen: boolean,
  page: string,
) => {
  trackEvent(
    "section_toggle",
    "ui_interaction",
    `${page}_${section}_${isOpen ? "open" : "close"}`,
  );
};

export const trackImageClick = (imageName: string, page: string) => {
  trackEvent("image_click", "ui_interaction", `${page}_${imageName}`);
};

export const trackLightboxOpen = (page: string) => {
  trackEvent("lightbox_open", "ui_interaction", page);
};

export const trackLightboxClose = (page: string) => {
  trackEvent("lightbox_close", "ui_interaction", page);
};

export const trackDarkModeToggle = (isDark: boolean) => {
  trackEvent("dark_mode_toggle", "ui_interaction", isDark ? "dark" : "light");
};

export const trackMobileMenuToggle = (isOpen: boolean) => {
  trackEvent("mobile_menu_toggle", "ui_interaction", isOpen ? "open" : "close");
};

export const trackLogoClick = () => {
  trackEvent("logo_click", "navigation", "home");
};

export const trackLinkedInClick = () => {
  trackEvent("linkedin_click", "engagement", "linkedin_link");
};

export const trackEmailClick = () => {
  trackEvent("email_click", "engagement", "email_link");
};

// Enhanced Project Engagement Tracking
export const trackProjectEngagement = (
  projectSlug: string,
  engagementData: {
    sectionsViewed: number;
    timeSpent: number;
    interactions: number;
    scrollDepth: number;
  },
) => {
  trackEvent("project_engagement", "engagement", {
    project_slug: projectSlug,
    sections_viewed: engagementData.sectionsViewed,
    time_spent_seconds: engagementData.timeSpent,
    total_interactions: engagementData.interactions,
    scroll_depth_percentage: engagementData.scrollDepth,
  });
};

export const trackProjectInteraction = (
  projectSlug: string,
  interactionType: string,
  details?: Record<string, unknown>,
) => {
  trackEvent("project_interaction", "engagement", {
    project_slug: projectSlug,
    interaction_type: interactionType,
    details: details || {},
  });
};

export const trackProjectConversion = (
  projectSlug: string,
  conversionType: string,
) => {
  trackEvent("project_conversion", "conversion", {
    project_slug: projectSlug,
    conversion_type: conversionType,
  });
};

export const trackProjectTimeSpent = (
  projectSlug: string,
  timeSpent: number,
) => {
  trackEvent("project_time_spent", "engagement", {
    project_slug: projectSlug,
    time_spent_seconds: timeSpent,
  });
};

// Page Engagement and Time Tracking
export const trackPageEngagement = (
  pagePath: string,
  engagementData: {
    timeSpent: number;
    scrollDepth: number;
    interactions: number;
    sectionsViewed?: number;
  },
) => {
  trackEvent("page_engagement", "engagement", {
    page_path: pagePath,
    time_spent_seconds: engagementData.timeSpent,
    scroll_depth_percentage: engagementData.scrollDepth,
    total_interactions: engagementData.interactions,
    sections_viewed: engagementData.sectionsViewed || 0,
  });
};

export const trackPageTimeSpent = (pagePath: string, timeSpent: number) => {
  trackEvent("page_time_spent", "engagement", {
    page_path: pagePath,
    time_spent_seconds: timeSpent,
  });
};

export const trackPageInteraction = (
  pagePath: string,
  interactionType: string,
  details?: Record<string, unknown>,
) => {
  trackEvent("page_interaction", "engagement", {
    page_path: pagePath,
    interaction_type: interactionType,
    details: details || {},
  });
};

// Custom Dimensions & Metrics
export const setUserType = (
  userType: "recruiter" | "designer" | "developer" | "other",
) => {
  if (!ANALYTICS_CONFIG.enabled || !ANALYTICS_CONFIG.measurementId) {
    return;
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", ANALYTICS_CONFIG.measurementId, {
      custom_map: {
        custom_dimension1: "user_type",
      },
      user_type: userType,
    });
  }
};

export const setProjectCategory = (category: string) => {
  if (!ANALYTICS_CONFIG.enabled || !ANALYTICS_CONFIG.measurementId) {
    return;
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", ANALYTICS_CONFIG.measurementId, {
      custom_map: {
        custom_dimension2: "project_category",
      },
      project_category: category,
    });
  }
};

export const setInteractionDepth = (depth: number) => {
  if (!ANALYTICS_CONFIG.enabled || !ANALYTICS_CONFIG.measurementId) {
    return;
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", ANALYTICS_CONFIG.measurementId, {
      custom_map: {
        custom_metric1: "interaction_depth",
      },
      interaction_depth: depth,
    });
  }
};

// Enhanced User Properties for Demographics
export const setUserProperties = (properties: {
  user_type?: "recruiter" | "designer" | "developer" | "other";
  project_category?: string;
  interaction_depth?: number;
  visit_frequency?: "first_time" | "returning" | "frequent";
  device_type?: "desktop" | "mobile" | "tablet";
  time_of_day?: "morning" | "afternoon" | "evening" | "night";
  day_of_week?: "weekday" | "weekend";
}) => {
  if (!ANALYTICS_CONFIG.enabled || !ANALYTICS_CONFIG.measurementId) {
    return;
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", ANALYTICS_CONFIG.measurementId, {
      custom_map: {
        custom_dimension1: "user_type",
        custom_dimension2: "project_category",
        custom_dimension3: "visit_frequency",
        custom_dimension4: "device_type",
        custom_dimension5: "time_of_day",
        custom_dimension6: "day_of_week",
        custom_metric1: "interaction_depth",
      },
      ...properties,
    });
  }
};

// Test function to force send all custom dimensions
export const testCustomDimensions = () => {
  if (typeof window !== "undefined" && window.gtag) {
    // Send a test event with all custom dimensions
    window.gtag("event", "test_custom_dimensions", {
      custom_map: {
        custom_dimension1: "user_type",
        custom_dimension2: "project_category",
        custom_dimension3: "visit_frequency",
        custom_dimension4: "device_type",
        custom_dimension5: "time_of_day",
        custom_dimension6: "day_of_week",
        custom_metric1: "interaction_depth",
      },
      user_type: "test_user",
      project_category: "test_category",
      visit_frequency: "first_time",
      device_type: "desktop",
      time_of_day: "afternoon",
      day_of_week: "weekday",
      interaction_depth: 5,
    });
  }
};
