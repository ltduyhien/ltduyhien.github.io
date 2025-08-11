// User Type Detection based on behavior patterns
export const detectUserType = (behavior: {
  pagesVisited: string[];
  projectsClicked: string[];
  timeSpent: number;
  interactions: number;
  scrollDepth: number;
}): "recruiter" | "designer" | "developer" | "other" => {
  const {
    pagesVisited,
    projectsClicked,
    timeSpent,
    interactions,
    scrollDepth,
  } = behavior;

  // Recruiter patterns: Quick CV check, about page focus
  if (
    pagesVisited.includes("/cv") ||
    (pagesVisited.includes("/about") && timeSpent < 120) ||
    projectsClicked.length < 2
  ) {
    return "recruiter";
  }

  // Designer patterns: Deep project exploration, visual focus
  if (
    projectsClicked.some(
      (p) => p.includes("design") || p.includes("ui") || p.includes("ux"),
    ) ||
    scrollDepth > 80 ||
    interactions > 15
  ) {
    return "designer";
  }

  // Developer patterns: Technical project focus, code-related interactions
  if (
    projectsClicked.some(
      (p) => p.includes("api") || p.includes("backend") || p.includes("system"),
    ) ||
    pagesVisited.includes("/github") ||
    timeSpent > 300
  ) {
    return "developer";
  }

  return "other";
};

// Visit frequency detection
export const detectVisitFrequency = ():
  | "first_time"
  | "returning"
  | "frequent" => {
  const visitCount = localStorage.getItem("visit_count");
  const count = visitCount ? parseInt(visitCount) : 0;

  if (count === 0) {
    localStorage.setItem("visit_count", "1");
    return "first_time";
  } else if (count < 3) {
    localStorage.setItem("visit_count", (count + 1).toString());
    return "returning";
  } else {
    localStorage.setItem("visit_count", (count + 1).toString());
    return "frequent";
  }
};

// Device type detection
export const detectDeviceType = (): "desktop" | "mobile" | "tablet" => {
  const userAgent = navigator.userAgent;
  const screenWidth = window.innerWidth;

  if (
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  ) {
    return screenWidth > 768 ? "tablet" : "mobile";
  }

  return "desktop";
};

// Time of day detection
export const detectTimeOfDay = ():
  | "morning"
  | "afternoon"
  | "evening"
  | "night" => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
};

// Day of week detection
export const detectDayOfWeek = (): "weekday" | "weekend" => {
  const day = new Date().getDay();
  return day === 0 || day === 6 ? "weekend" : "weekday";
};

// Geographic information (basic detection)
export const detectGeographicInfo = () => {
  // Note: This is basic detection. For more accurate data, you'd need a geolocation service
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;

  return {
    timezone,
    language,
    // You can add more sophisticated detection here
  };
};

// Interest detection based on project interactions
export const detectInterests = (projectsClicked: string[]): string[] => {
  const interests: string[] = [];

  if (projectsClicked.some((p) => p.includes("mobile")))
    interests.push("mobile_development");
  if (projectsClicked.some((p) => p.includes("desktop")))
    interests.push("desktop_applications");
  if (projectsClicked.some((p) => p.includes("saas")))
    interests.push("saas_platforms");
  if (projectsClicked.some((p) => p.includes("ai")))
    interests.push("artificial_intelligence");
  if (projectsClicked.some((p) => p.includes("design")))
    interests.push("ui_ux_design");
  if (projectsClicked.some((p) => p.includes("api")))
    interests.push("api_development");
  if (projectsClicked.some((p) => p.includes("system")))
    interests.push("system_architecture");

  return interests;
};
