/**
 * @fileoverview Configuration utility for portfolio environment variables
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

// Portfolio Settings
export const PORTFOLIO_CONFIG = {
  title:
    import.meta.env.VITE_PORTFOLIO_TITLE ||
    "Hien Le | Product Designer Portfolio",
  description:
    import.meta.env.VITE_PORTFOLIO_DESCRIPTION ||
    "Senior/Lead Product Designer based in Espoo, Finland",
  location: import.meta.env.VITE_PORTFOLIO_LOCATION || "Espoo, Finland",
  company: import.meta.env.VITE_PORTFOLIO_COMPANY || "UL Solutions",
} as const;

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  enabled: import.meta.env.VITE_GA_ENABLED === "true",
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || "",
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  darkMode: import.meta.env.VITE_ENABLE_DARK_MODE === "true",
  projectNavigation: import.meta.env.VITE_ENABLE_PROJECT_NAVIGATION === "true",
} as const;

// Security Settings
export const SECURITY_CONFIG = {
  contentSource: import.meta.env.VITE_CONTENT_SOURCE || "submodule",
  stylingSource: import.meta.env.VITE_STYLING_SOURCE || "submodule",
  maxProjectsPerPage: parseInt(
    import.meta.env.VITE_MAX_PROJECTS_PER_PAGE || "20",
    10,
  ),
} as const;

// Development Settings
export const DEV_CONFIG = {
  mode: import.meta.env.VITE_DEV_MODE || "development",
  hotReload: import.meta.env.VITE_ENABLE_HOT_RELOAD === "true",
  debugLogging: import.meta.env.VITE_ENABLE_DEBUG_LOGGING === "true",
} as const;

// Environment validation
export const validateEnvironment = (): void => {
  const requiredVars = [
    "VITE_PORTFOLIO_TITLE",
    "VITE_PORTFOLIO_DESCRIPTION",
    "VITE_PORTFOLIO_LOCATION",
    "VITE_PORTFOLIO_COMPANY",
  ];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName],
  );

  if (missingVars.length > 0 && DEV_CONFIG.debugLogging) {
    console.warn("Missing environment variables:", missingVars);
    console.warn("Using fallback values. Create a .env file for production.");
  }
};

// Initialize validation
validateEnvironment();

// Export all config as a single object for easy access
export const CONFIG = {
  portfolio: PORTFOLIO_CONFIG,
  analytics: ANALYTICS_CONFIG,
  features: FEATURE_FLAGS,
  security: SECURITY_CONFIG,
  dev: DEV_CONFIG,
} as const;
