/**
 * @fileoverview Home page component for Hien Le's portfolio
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

import Chip from "../components/Chip";
import ProjectCard from "../components/ProjectCard";
import ExperienceCard from "../components/ExperienceCard";
import Footer from "../components/Footer";
import { usePageEngagement } from "../hooks/usePageEngagement";
import { trackCollapseAll, trackSectionToggle } from "../utils/analytics";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { getProjectsList } from "../generated/content-bundle";

import type { ProjectData } from "./ProjectSingle";
import { HOMEPAGE_PROJECTS } from "./projectsOrder";

// Images are now loaded from the generated content bundle

const Home = () => {
  // Page engagement tracking
  const { trackInteraction } = usePageEngagement({
    trackInteractions: true,
    trackScroll: true,
  });

  // Track open/closed state for each section
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [buttonLeft, setButtonLeft] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chipsScrollRef = useRef<HTMLDivElement>(null);

  const tags = [
    "SaaS",
    "Open-source",
    "AI",
    "Data Analytics",
    "Developer Tools",
    "Telecommunications",
    "Smart Devices",
    "Mobile Apps",
    "Media Streaming",
    "File Systems",
    "Design Systems",
    "User Research",
  ];

  const [projects, setProjects] = useState<ProjectData[]>([]);

  // Smooth scroll to top when navigating to Home page
  useScrollToTop({
    autoScroll: true,
    behavior: "smooth",
    delay: 100,
  });

  const handleSectionToggle = useCallback((key: string, open: boolean) => {
    setOpenSections((prev) => ({ ...prev, [key]: open }));
    trackSectionToggle(key, open, "home");
  }, []);

  const handleCollapseAll = useCallback(() => {
    setOpenSections({});
    trackCollapseAll("home");
  }, []);

  const updateButtonPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const left = rect.left + rect.width / 2;
      setButtonLeft(`${left}px`);
    }
  }, []);

  useEffect(() => {
    updateButtonPosition();
    window.addEventListener("resize", updateButtonPosition);
    return () => {
      window.removeEventListener("resize", updateButtonPosition);
    };
  }, [updateButtonPosition]);

  // Handle chips scroll indicators and set default scroll position
  useEffect(() => {
    const container = chipsScrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollLeft > 0) {
        container.classList.add("scrolled");
      } else {
        container.classList.remove("scrolled");
      }
      const atEnd =
        Math.ceil(container.scrollLeft + container.clientWidth) >=
        container.scrollWidth - 1;
      if (atEnd) {
        container.classList.add("at-end");
      } else {
        container.classList.remove("at-end");
      }
    };

    // Smooth touch scrolling for iOS with momentum
    let startX = 0;
    let startTime = 0;
    let scrollLeft = 0;
    let isDown = false;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let animationId: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      startTime = Date.now();
      scrollLeft = container.scrollLeft;
      lastX = startX;
      lastTime = startTime;
      velocity = 0;
      
      // Cancel any ongoing momentum animation
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      e.preventDefault();
      
      const currentX = e.touches[0].pageX - container.offsetLeft;
      const currentTime = Date.now();
      const deltaX = currentX - lastX;
      const deltaTime = currentTime - lastTime;
      
      // Calculate velocity (pixels per millisecond)
      if (deltaTime > 0) {
        velocity = deltaX / deltaTime;
      }
      
      // Apply scroll with resistance at edges
      const walk = currentX - startX;
      const newScrollLeft = scrollLeft - walk;
      
      // Add resistance at edges
      let finalScrollLeft = newScrollLeft;
      if (newScrollLeft < 0) {
        finalScrollLeft = newScrollLeft * 0.3; // Resistance at left edge
      } else if (newScrollLeft > container.scrollWidth - container.clientWidth) {
        const overscroll = newScrollLeft - (container.scrollWidth - container.clientWidth);
        finalScrollLeft = (container.scrollWidth - container.clientWidth) + (overscroll * 0.3); // Resistance at right edge
      }
      
      container.scrollLeft = finalScrollLeft;
      
      lastX = currentX;
      lastTime = currentTime;
    };

    const handleTouchEnd = () => {
      isDown = false;
      
      // Apply momentum scrolling
      if (Math.abs(velocity) > 0.5) { // Only apply momentum if velocity is significant
        const momentum = () => {
          velocity *= 0.95; // Decay factor
          container.scrollLeft += velocity * 16; // 16ms = 60fps
          
          // Stop momentum when velocity is too low or hitting edges
          if (Math.abs(velocity) > 0.1 && 
              container.scrollLeft > 0 && 
              container.scrollLeft < container.scrollWidth - container.clientWidth) {
            animationId = requestAnimationFrame(momentum);
          }
        };
        
        animationId = requestAnimationFrame(momentum);
      }
    };

    container.addEventListener("scroll", handleScroll);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);
    
    // run once to set initial state
    handleScroll();
    
    // Ensure initial state styles are correct without forcing scroll position

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      
      // Cancel any ongoing animation
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  useEffect(() => {
    function loadProjects() {
      try {
        // Use the generated content bundle instead of importing from submodules
        const allProjects = getProjectsList();

        // Filter to only show homepage projects
        const loaded = HOMEPAGE_PROJECTS.map((proj) => {
          const projectData = allProjects.find((p) => p.slug === proj.slug);

          if (projectData) {
            return {
              ...projectData,
              slug: proj.slug,
              // Use the banner path from the content bundle
              imageUrl: projectData.banner || "",
            } as ProjectData;
          }
          return null;
        }).filter((project): project is ProjectData => project !== null);

        setProjects(loaded);
      } catch (error) {
        console.error("Failed to load projects from content bundle:", error);
        setProjects([]);
      }
    }
    loadProjects();
  }, []);

  return (
    <>
      <div
        className="container-custom px-8 pt-24 pb-0 md:pt-8 md:pb-0"
        ref={containerRef}
      >
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white leading-relaxed">
          <span className="font-bold">Senior Product Designer</span>
          <br />
          <span className="font-medium">
            13+ yrs in SaaS & Technical Products
          </span>
        </h2>
      </div>
      
      {/* Mobile: full-width chips with left alignment */}
      <div className="md:hidden">
        <div className="mb-6">
          <div
                              className="chips-scroll-container flex flex-nowrap gap-2 overflow-hidden pb-1 min-w-0 w-full"
            ref={chipsScrollRef}
                          style={{
                paddingLeft: "2rem",
                paddingRight: "1rem"
              } as React.CSSProperties}
          >
            <div className="flex flex-nowrap gap-2 min-w-max">
              {tags.map((tag) => (
                <Chip key={tag} text={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: clamp to container, no overflow UI */}
      <div className="container-custom px-8 hidden md:block">
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <Chip key={tag} text={tag} />
          ))}
        </div>
      </div>
      
      <div className="container-custom px-8 pb-16">
      <p className="mb-4 text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
        Hello, I am Hien. I am a Senior/Lead Product Designer based in Espoo,
        Finland. Currently designing features that help you improve and track
        your computer hardware performance at UL Solutions. My work focuses on
        user research, iterative design, and measurable impact across SaaS
        platforms, enterprise tools, desktop applications, mobile applications,
        and AI-powered features.
      </p>

      <h3 className="text-lg font-medium mb-4 mt-8 text-zinc-900 dark:text-white">
        My Work
      </h3>
      <div className="flex flex-col gap-6">
        {projects.map((project, idx) => (
          <Link
            key={idx}
            to={`/projects/${project.slug}`}
            className="block"
            onClick={() =>
              trackInteraction("home_project_click", {
                project_slug: project.slug,
                position: idx + 1,
              })
            }
          >
            <ProjectCard
              title={project.title}
              subtitle={project.subtext || ""}
              tags={project.industries || []}
              imageUrl={project.imageUrl || ""}
            />
          </Link>
        ))}
      </div>
      <div className="mt-4 mb-10">
        <Link
          to="/projects"
          className="text-brand font-medium flex items-center gap-1 hover:underline"
        >
          See all projects <span className="inline-block">&rarr;</span>
        </Link>
      </div>
      <h3 className="text-xl font-medium mb-4 text-zinc-900 dark:text-white">
        My Experience
      </h3>
      <ExperienceCard
        title="Product Design Specialist - UL Solutions (Former Futuremark)"
        date="2023 - Present"
        isOpen={!!openSections["ul-solutions"]}
        onToggle={(open) => handleSectionToggle("ul-solutions", open)}
      >
        <p>
          Led product design for flagship benchmarking applications across
          desktop, mobile, and web platforms:
        </p>
        <ul className="list-disc pl-8 space-y-1 mt-4">
          <li>
            <strong>3DMark</strong>: Cross-platform benchmarking tool (Windows,
            macOS, iOS, Android)
          </li>
          <li>
            <strong>Procyon</strong>: Professional performance testing software
            for Windows
          </li>
          <li>
            <strong>TestDriver Cloud</strong>: Enterprise SaaS for automated PC
            benchmarking
          </li>
          <li>
            Established design systems and collaborated with engineering teams
            to modernize user interfaces
          </li>
        </ul>
      </ExperienceCard>
      <ExperienceCard
        title="Senior UX Designer - Nokia Oyj"
        date="2022 - 2023"
        isOpen={!!openSections["nokia"]}
        onToggle={(open) => handleSectionToggle("nokia", open)}
      >
        <p>
          Led UX design for enterprise cloud and network services solutions:
        </p>
        <ul className="list-disc pl-8 space-y-1 mt-4">
          <li>
            Designed <strong>AVA Open Analytics</strong> and{" "}
            <strong>CPQ Pricing Tool</strong> through end-to-end design process
          </li>
          <li>
            Conducted user research and usability testing to identify pain
            points and validate solutions
          </li>
          <li>
            Collaborated with designers, architects, and end-users across
            enterprise teams
          </li>
        </ul>
      </ExperienceCard>
      <ExperienceCard
        title="Lead UX Designer - Tuxera Oy"
        date="2012 - 2021"
        isOpen={!!openSections["tuxera"]}
        onToggle={(open) => handleSectionToggle("tuxera", open)}
      >
        <p>
          Led product design and development across multiple platforms and
          technologies:
        </p>
        <ul className="list-disc pl-8 space-y-1 mt-4">
          <li>
            <strong>Tuxera Disk Manager</strong>: Native macOS app for disk
            management and file system tools
          </li>
          <li>
            <strong>TSMB Admin Panel</strong>: Web dashboard for enterprise file
            system administration
          </li>
          <li>
            <strong>Riva Speaker & Alexa Apps</strong>: Mobile apps for wireless
            speaker control (iOS/Android)
          </li>
          <li>
            <strong>AllConnect Mobile App</strong>: CES 2017 Honoree Award for
            media streaming (iOS/Android)
          </li>
          <li>
            <strong>Performance Dashboards</strong>: Web apps for monitoring
            MooseFS and comparing file system performance
          </li>
          <li>
            Designed and implemented <strong>Tuxera website</strong> and{" "}
            <strong>NTFS for Mac website</strong> with full-stack development
          </li>
          <li>
            Established Tuxera's brand identity and created marketing materials
            including white papers
          </li>
        </ul>
      </ExperienceCard>
      <ExperienceCard
        title="UX Software Engineer - RunToShop"
        date="2011 - 2012"
        isOpen={!!openSections["runtoshop"]}
        onToggle={(open) => handleSectionToggle("runtoshop", open)}
      >
        <p>User research and frontend development for web applications:</p>
        <ul className="list-disc pl-8 space-y-1 mt-4">
          <li>
            Conducted user research and designed websites and web applications
          </li>
          <li>Developed web frontend interfaces and user experiences</li>
        </ul>
      </ExperienceCard>
      <div className="mt-4 mb-10">
        <Link
          to="/about"
          className="text-brand font-medium flex items-center gap-1 hover:underline"
        >
          See more about me <span className="inline-block">&rarr;</span>
        </Link>
      </div>
      <Footer />
      {Object.values(openSections).some(Boolean) && buttonLeft && (
        <button
          onClick={handleCollapseAll}
          className="fixed bottom-8 z-50 bg-zinc-900 text-zinc-100 px-6 py-3 rounded-full shadow-lg font-semibold text-sm hover:bg-zinc-800 transition"
          style={{
            left: buttonLeft,
            transform: "translateX(-50%)",
            pointerEvents: "auto",
          }}
        >
          Collapse All
        </button>
      )}
      </div>
    </>
  );
};

export default Home;
