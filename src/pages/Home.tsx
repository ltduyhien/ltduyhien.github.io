/**
 * @fileoverview Home page component for Hien Le's portfolio
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import Chip from '../components/Chip';
import ProjectCard from '../components/ProjectCard';
import ExperienceCard from '../components/ExperienceCard';
import Footer from '../components/Footer';
import { usePageEngagement } from '../hooks/usePageEngagement';
import { trackCollapseAll, trackSectionToggle } from '../utils/analytics';

import type { ProjectData } from './ProjectSingle';
import { HOMEPAGE_PROJECTS } from './projectsOrder';

// Vite dynamic image import from private projects via symlink
const projectImages = import.meta.glob('./projects-private/*/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

const Home = () => {
  // Page engagement tracking
  const { trackInteraction } = usePageEngagement({
    trackInteractions: true,
    trackScroll: true
  });
  
  // Track open/closed state for each section
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [buttonLeft, setButtonLeft] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const tags = [
    'SaaS',
    'Open-source',
    'AI',
    'Data Analytics',
    'Developer Tools',
    'Telecommunications',
    'Smart Devices',
    'Mobile Apps',
    'Media Streaming',
    'File Systems',
    'Design Systems',
    'User Research',
  ];

  const [projects, setProjects] = useState<ProjectData[]>([]);

  const handleSectionToggle = useCallback((key: string, open: boolean) => {
    setOpenSections((prev) => ({ ...prev, [key]: open }));
    trackSectionToggle(key, open, 'home');
  }, []);

  const handleCollapseAll = useCallback(() => {
    setOpenSections({});
    trackCollapseAll('home');
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
    window.addEventListener('resize', updateButtonPosition);
    return () => window.removeEventListener('resize', updateButtonPosition);
  }, [updateButtonPosition]);

  useEffect(() => {
    async function loadProjects() {
      const loaded = await Promise.all(
        HOMEPAGE_PROJECTS.map(async (proj) => {
          try {
            const mod = await import(`./projects-private/${proj.slug}/data.json`);
            return { ...mod.default, slug: proj.slug };
          } catch {
            return null;
          }
        }),
      );
      setProjects(loaded.filter(Boolean));
    }
    loadProjects();
  }, []);

  function getBannerUrl(slug: string, banner?: string): string {
    if (!banner) return '';
    const key = `../projects/${slug}/${banner}`;
    const url = projectImages[key];
    return typeof url === 'string' ? url : '';
  }

  return (
    <div className="container-custom px-8 pt-24 pb-16 md:pt-8 md:pb-16" ref={containerRef}>
      <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white leading-relaxed">
        <span className="font-bold">Senior Product Designer</span>
        <br />
        <span className="font-medium">13+ yrs in SaaS & Technical Products</span>
      </h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <Chip key={tag} text={tag} />
        ))}
      </div>
      <p className="mb-4 text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
        Hello, I am Hien. I am a Senior/Lead Product Designer based in Espoo, Finland. Currently designing features that help you improve and track your computer hardware performance at UL Solutions. My work focuses on user research, iterative design, and measurable impact across SaaS platforms, enterprise tools, desktop applications, mobile applications, and AI-powered features.
      </p>

      <h3 className="text-lg font-medium mb-4 mt-8 text-zinc-900 dark:text-white">My Work</h3>
      <div className="flex flex-col gap-6">
        {projects.map((project, idx) => (
          <Link 
            key={idx} 
            to={`/projects/${project.slug}`} 
            className="block"
            onClick={() => trackInteraction('home_project_click', { 
              project_slug: project.slug,
              position: idx + 1
            })}
          >
            <ProjectCard
              title={project.title}
              subtitle={project.subtext || ''}
              tags={project.industries || []}
              imageUrl={getBannerUrl(String(project.slug || ''), String(project.banner || ''))}
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
      <h3 className="text-xl font-medium mb-4 text-zinc-900 dark:text-white">My Experience</h3>
      <ExperienceCard
        title="Product Design Specialist - UL Solutions (Former Futuremark)"
        date="2023 - Present"
        isOpen={!!openSections['ul-solutions']}
        onToggle={(open) => handleSectionToggle('ul-solutions', open)}
      >
        <p>
          Led product design for flagship benchmarking applications across desktop, mobile, and web
          platforms:
        </p>
        <ul className="list-disc pl-8 space-y-1 mt-4">
          <li>
            <strong>3DMark</strong>: Cross-platform benchmarking tool (Windows, macOS, iOS, Android)
          </li>
          <li>
            <strong>Procyon</strong>: Professional performance testing software for Windows
          </li>
          <li>
            <strong>TestDriver Cloud</strong>: Enterprise SaaS for automated PC benchmarking
          </li>
          <li>
            Established design systems and collaborated with engineering teams to modernize user
            interfaces
          </li>
        </ul>
      </ExperienceCard>
      <ExperienceCard 
        title="Senior UX Designer - Nokia Oyj" 
        date="2022 - 2023"
        isOpen={!!openSections['nokia']}
        onToggle={(open) => handleSectionToggle('nokia', open)}
      >
        <p>Led UX design for enterprise cloud and network services solutions:</p>
        <ul className="list-disc pl-8 space-y-1 mt-4">
          <li>
            Designed <strong>AVA Open Analytics</strong> and <strong>CPQ Pricing Tool</strong> through end-to-end design process
          </li>
          <li>
            Conducted user research and usability testing to identify pain points and validate
            solutions
          </li>
          <li>Collaborated with designers, architects, and end-users across enterprise teams</li>
        </ul>
      </ExperienceCard>
      <ExperienceCard 
        title="Lead UX Designer - Tuxera Oy" 
        date="2012 - 2021"
        isOpen={!!openSections['tuxera']}
        onToggle={(open) => handleSectionToggle('tuxera', open)}
      >
        <p>Led product design and development across multiple platforms and technologies:</p>
        <ul className="list-disc pl-8 space-y-1 mt-4">
          <li>
            <strong>Tuxera Disk Manager</strong>: Native macOS app for disk management and file
            system tools
          </li>
          <li>
            <strong>TSMB Admin Panel</strong>: Web dashboard for enterprise file system
            administration
          </li>
          <li>
            <strong>Riva Speaker & Alexa Apps</strong>: Mobile apps for wireless speaker control
            (iOS/Android)
          </li>
          <li>
            <strong>AllConnect Mobile App</strong>: CES 2017 Honoree Award for media streaming
            (iOS/Android)
          </li>
          <li>
            <strong>Performance Dashboards</strong>: Web apps for monitoring MooseFS and comparing
            file system performance
          </li>
          <li>
            Designed and implemented <strong>Tuxera website</strong> and{' '}
            <strong>NTFS for Mac website</strong> with full-stack development
          </li>
          <li>
            Established Tuxera's brand identity and created marketing materials including white
            papers
          </li>
        </ul>
      </ExperienceCard>
      <ExperienceCard 
        title="UX Software Engineer - RunToShop" 
        date="2011 - 2012"
        isOpen={!!openSections['runtoshop']}
        onToggle={(open) => handleSectionToggle('runtoshop', open)}
      >
        <p>User research and frontend development for web applications:</p>
        <ul className="list-disc pl-8 space-y-1 mt-4">
          <li>Conducted user research and designed websites and web applications</li>
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
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
          }}
        >
          Collapse All
        </button>
      )}
    </div>
  );
};

export default Home;
