import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ProjectCard from '../components/ProjectCard';
import Footer from '../components/Footer';
import { usePageEngagement } from '../hooks/usePageEngagement';
import { setProjectCategory } from '../utils/analytics';

import type { ProjectData } from './ProjectSingle';
import { PROJECTS_ORDER } from './projectsOrder';
import { getProjectsList } from '../generated/content-bundle';

// No longer needed - using generated content bundle instead

const Projects = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  
  // Page engagement tracking
  const { trackInteraction } = usePageEngagement({
    trackInteractions: true,
    trackScroll: true
  });

  useEffect(() => {
    console.log('Loading projects from content bundle...');
    
    try {
      // Use the generated content bundle instead of importing from submodules
      const projectsList = getProjectsList();
      const loaded = projectsList.map((proj) => ({
        ...proj,
        // Use the banner path from the generated content bundle
        imageUrl: proj.banner || ''
      }));
      
      setProjects(loaded);
      console.log(`Loaded ${loaded.length} projects from content bundle`);
    } catch (error) {
      console.error('Failed to load projects from content bundle:', error);
      setProjects([]);
    }
  }, []);

  // Banner URLs are now handled by the generated content bundle

  // Categorize projects
  const saasProjects = projects.filter(
    (project) =>
      project.slug === 'test-driver-cloud' ||
      project.slug === 'cpq-pricing-tool' ||
      project.slug === 'smb-admin-panel' ||
      project.slug === 'nokia-data-suite',
  );

  const mobileProjects = projects.filter(
    (project) => project.slug === 'allconnect-app' || project.slug === '3dmark-ios-app' || project.slug === 'riva-audio',
  );

  const desktopProjects = projects.filter(
    (project) => project.slug === 'procyon-desktop-client',
  );

  const designSystemProjects = projects.filter(
    (project) => project.slug === '3dmark-design-system',
  );
  
  console.log('Projects state:', projects);
  console.log('SaaS projects:', saasProjects);
  console.log('Mobile projects:', mobileProjects);
  console.log('Desktop projects:', desktopProjects);
  console.log('Design system projects:', designSystemProjects);

  return (
    <div className="container-custom px-8 pt-24 pb-16 md:py-16">
      <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
        Selected work & highlights
      </h2>
      <p className="mb-8 text-base font-medium text-zinc-700 dark:text-zinc-200 leading-relaxed max-w-2xl">
        Over the years, I have worked across different industries, from SaaS platforms and
        enterprise tools to mobile apps and hardware integration. Each project presented unique
        challenges: simplifying complex pricing logic for sales teams, making hardware performance
        data accessible to engineers, or designing mobile experiences that bridge the gap between
        technical accuracy and user-friendly interfaces. These projects reflect my journey through
        telecommunications, data analytics, developer tools, and smart devices, always focusing on
        how design can make technical systems more approachable and effective.
      </p>

      <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">
        SaaS Enterprise Applications
      </h3>
      <div className="flex flex-col gap-6 mb-12">
        {saasProjects.map((project, idx) => (
          <Link 
            key={idx} 
            to={`/projects/${project.slug}`} 
            className="block"
            onClick={() => {
              trackInteraction('project_card_click', { 
                project_slug: project.slug,
                category: 'saas_enterprise_applications'
              });
              setProjectCategory('SaaS Enterprise Applications');
            }}
          >
            <ProjectCard
              title={project.title}
              subtitle={project.subtext || ''}
              tags={project.industries || []}
              imageUrl={project.imageUrl || ''}
            />
          </Link>
        ))}
      </div>

      <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">Mobile Applications</h3>
      <div className="flex flex-col gap-6 mb-12">
        {mobileProjects.map((project, idx) => (
          <Link 
            key={idx} 
            to={`/projects/${project.slug}`} 
            className="block"
            onClick={() => {
              trackInteraction('project_card_click', { 
                project_slug: project.slug,
                category: 'mobile_applications'
              });
              setProjectCategory('Mobile Applications');
            }}
          >
            <ProjectCard
              title={project.title}
              subtitle={project.subtext || ''}
              tags={project.industries || []}
              imageUrl={project.imageUrl || ''}
            />
          </Link>
        ))}
      </div>

      <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">Desktop Applications</h3>
      <div className="flex flex-col gap-6 mb-12">
        {desktopProjects.map((project, idx) => (
          <Link 
            key={idx} 
            to={`/projects/${project.slug}`} 
            className="block"
            onClick={() => {
              trackInteraction('project_card_click', { 
                project_slug: project.slug,
                category: 'desktop_applications'
              });
              setProjectCategory('Desktop Applications');
            }}
          >
            <ProjectCard
              title={project.title}
              subtitle={project.subtext || ''}
              tags={project.industries || []}
              imageUrl={project.imageUrl || ''}
            />
          </Link>
        ))}
      </div>

      <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">Design Systems</h3>
      <div className="flex flex-col gap-6">
        {designSystemProjects.map((project, idx) => (
          <Link 
            key={idx} 
            to={`/projects/${project.slug}`} 
            className="block"
            onClick={() => {
              trackInteraction('project_card_click', { 
                project_slug: project.slug,
                category: 'design_systems'
              });
              setProjectCategory('Design Systems');
            }}
          >
            <ProjectCard
              title={project.title}
              subtitle={project.subtext || ''}
              tags={project.industries || []}
              imageUrl={project.imageUrl || ''}
            />
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Projects;
