import React, { useRef, useEffect } from "react";

import Chip from "./Chip";

type ProjectCardProps = {
  title: string;
  subtitle: string;
  tags: string[];
  imageUrl: string;
};

const ProjectCard = ({ title, subtitle, tags, imageUrl }: ProjectCardProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
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

    container.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // (Alignment handled purely via CSS full-bleed container)

  return (
    <div className="project-card group flex flex-col md:flex-row gap-4 [border-radius:4px_/_4px] transition-transform duration-300 md:hover:scale-[1.02]">
      <div className="flex-shrink-0 w-full md:w-56 overflow-hidden [border-radius:4px_/_4px]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Project preview"
            className="w-full h-auto [border-radius:6px_/_6px] md:border-2 md:border-zinc-200 md:dark:border-zinc-700"
            style={{ boxSizing: "border-box" }}
          />
        ) : (
          <span className="text-zinc-400 dark:text-zinc-300 text-sm md:text-base">
            Project preview
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between gap-2 py-2 md:max-w-[400px]">
        <h3 className="text-lg md:text-base font-bold leading-normal text-zinc-900 dark:text-white mb-0">
          {title}
        </h3>
        <p className="text-base md:text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">
          {subtitle}
        </p>
        <div className="relative">
          {/* Mobile: full-width chips */}
          <div className="md:hidden -mx-8">
            <div
              ref={scrollContainerRef}
              className="chips-scroll-container flex flex-nowrap gap-2 mt-auto overflow-x-auto scrollbar-hide scrollbar-hide-ios pb-1 min-w-0 w-full"
              style={{ 
                scrollbarWidth: "none", 
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                WebkitScrollbarWidth: "none",
                WebkitScrollbarHeight: "none",
                paddingLeft: "2rem",
                paddingRight: "2rem"
              } as React.CSSProperties}
            >
              <div className="flex flex-nowrap gap-2 min-w-max">
                {tags.map((tag) => (
                  <Chip key={tag} text={tag} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Desktop: normal chips layout */}
          <div className="hidden md:block">
            <div className="flex flex-wrap gap-2 mt-auto">
              {tags.map((tag) => (
                <Chip key={tag} text={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
