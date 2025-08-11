import React, { useState, useRef, useCallback, useEffect } from 'react';

import ExperienceCard from '../components/ExperienceCard';
import Footer from '../components/Footer';
import { 
  trackCVDownload, 
  trackCollapseAll, 
  trackSectionToggle, 
  trackLinkedInClick, 
  trackEmailClick,
  trackProjectConversion,
  setInteractionDepth
} from '../utils/analytics';
import { usePageEngagement } from '../hooks/usePageEngagement';
import { useScrollToTop } from '../hooks/useScrollToTop';

const About = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [buttonLeft, setButtonLeft] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Page engagement tracking
  const { trackInteraction, trackSectionView } = usePageEngagement({
    trackInteractions: true,
    trackScroll: true,
    trackSections: true
  });

  // Smooth scroll to top when navigating to About page
  useScrollToTop({
    autoScroll: true,
    behavior: 'smooth',
    delay: 150 // Slightly longer delay to ensure content is rendered
  });

  const handleSectionToggle = useCallback((key: string, isOpen: boolean) => {
    setOpenSections(prev => ({ ...prev, [key]: isOpen }));
    trackSectionToggle(key, isOpen, 'about');
    trackInteraction('section_toggle', { section: key, isOpen });
    if (isOpen) {
      trackSectionView(key);
    }
    
    // Update interaction depth
    const openCount = Object.values(openSections).filter(Boolean).length + (isOpen ? 1 : 0);
    setInteractionDepth(openCount);
  }, [trackInteraction, trackSectionView, openSections]);

  const handleCollapseAll = useCallback(() => {
    setOpenSections({});
    trackCollapseAll('about');
    trackInteraction('collapse_all');
  }, [trackInteraction]);

  const updateButtonPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const left = rect.left + rect.width / 2;
      setButtonLeft(`${left}px`);
    }
  }, []);

  useEffect(() => {
    function updatePosition() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const left = rect.left + rect.width / 2;
        setButtonLeft(`${left}px`);
      }
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [openSections, isLightboxOpen]);

  useEffect(() => {
    if (Object.values(openSections).some(Boolean) && buttonLeft && !isLightboxOpen) {
      const timeout = setTimeout(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const left = rect.left + rect.width / 2;
          setButtonLeft(`${left}px`);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [openSections, buttonLeft, isLightboxOpen]);
  return (
    <div ref={containerRef} className="container-custom px-8 pt-24 pb-16 md:pt-8 md:pb-16">
      <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white leading-relaxed">
        About Me
      </h2>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-shrink-0">
          <img
            src="/profile.jpg"
            alt="Hien Le - Senior Product Designer"
            className="max-w-48 rounded-lg border border-zinc-200 dark:border-zinc-700"
            style={{ boxSizing: 'border-box' }}
          />
        </div>
        <div className="flex-1">
          <p className="mb-4 text-base font-medium text-zinc-700 dark:text-zinc-200 leading-relaxed">
            I am a Senior/Lead Product Designer with over 13 years of experience in SaaS and technical
            products, based in Espoo, Finland. My journey started with coding and evolved into
            design when I realized I could bridge the gap between technical complexity and user
            needs. My work focuses on turning complex technical systems into intuitive digital
            experiences that drive real business outcomes.
          </p>
          <p className="text-base font-medium text-zinc-700 dark:text-zinc-200 leading-relaxed">
            My background in software development gives me a unique perspective on product design.
            Having written code and built systems myself, I understand the technical constraints and
            possibilities that developers face. This knowledge helps me create designs that are not
            only user-friendly but also technically feasible and maintainable. When I design
            interfaces for complex systems, I can anticipate implementation challenges and work
            closely with engineering teams to find practical solutions that balance user needs with
            technical requirements.
          </p>
        </div>
      </div>
      <h3 className="text-xl font-medium mb-4 text-zinc-900 dark:text-white">My Experience</h3>
      <ExperienceCard
        title="Product Design Specialist - UL Solutions (Former Futuremark)"
        date="2023 - Present"
        expandLock={false}
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
        expandLock={false}
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
          <li>
            Contributed to Nokia's enterprise analytics platform before transitioning to focus on
            benchmarking and performance tools at UL Solutions
          </li>
        </ul>
      </ExperienceCard>
      <ExperienceCard 
        title="Lead UX Designer - Tuxera Oy" 
        date="2012 - 2021"
        expandLock={false}
        isOpen={!!openSections['tuxera']}
        onToggle={(open) => handleSectionToggle('tuxera', open)}
      >
        <p>
          Led product design and development across multiple platforms and technologies, growing
          from UX Engineer to Lead Designer over 9 years:
        </p>
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
        expandLock={false}
        isOpen={!!openSections['runtoshop']}
        onToggle={(open) => handleSectionToggle('runtoshop', open)}
      >
        <p>User research and frontend development for web applications:</p>
        <ul className="list-disc pl-8 space-y-1 mt-4">
          <li>Conducted user research and designed websites and web applications</li>
          <li>Developed web frontend interfaces and user experiences</li>
        </ul>
      </ExperienceCard>
      <h3 className="text-xl font-medium mb-4 mt-8 text-zinc-900 dark:text-white">Education</h3>
      <ExperienceCard
        title="Metropolia University of Applied Sciences"
        date="2007 - 2011"
        expandLock={false}
        isOpen={!!openSections['metropolia']}
        onToggle={(open) => handleSectionToggle('metropolia', open)}
      >
        <p>Bachelor Degree in IT</p>
        <p className="mt-2 text-base text-zinc-700 dark:text-zinc-200 leading-relaxed">
          Major in Information Systems with focus on software development, database
          management, and system architecture. The program covered web technologies, user interface
          design, and enterprise software solutions, providing a strong foundation for technical
          product design and development.
        </p>
      </ExperienceCard>
      <ExperienceCard
        title="Foundations of User Experience Design"
        date="Google Certificate Program"
        expandLock={false}
        isOpen={!!openSections['google-cert']}
        onToggle={(open) => handleSectionToggle('google-cert', open)}
      >
        <p>Google Certificate Program</p>
        <p className="mt-2 text-base text-zinc-700 dark:text-zinc-200 leading-relaxed">
          Comprehensive UX design certification covering user research, wireframing, prototyping, and usability testing. The program included hands-on projects focused on creating user-centered design solutions, conducting user interviews, and developing interactive prototypes. This certification strengthened my understanding of design thinking methodologies and user experience best practices.
        </p>
      </ExperienceCard>
      <Footer />
      {Object.values(openSections).some(Boolean) && buttonLeft && !isLightboxOpen && (
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

export default About;
