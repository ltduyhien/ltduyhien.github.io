const e="Comprehensive design system for 3DMark ecosystem across web, mobile, and desktop platforms.",n="3DMark Design System at UL Solutions",t="3dmark-design-system",s="header.png",i=[{image:"principles.png",caption:"Design principles and philosophy"},{image:"fundamental.png",caption:"Core design tokens and foundational elements"},{image:"accessibility.png",caption:"WCAG guidelines and accessibility standards"},{image:"color-palette.png",caption:"Brand colors and color system"},{image:"typography.png",caption:"Font system and typography hierarchy"},{image:"spacing-layout.png",caption:"Grid system and spacing standards"},{image:"components.png",caption:"UI components library"},{image:"implementation.png",caption:"Code examples and technical implementation"}],a=[],o="Project Length: **12+ Months**",r="**Product Design Specialist**",c=["Design Systems","3D","Component Libraries"],l="Design System",d=`A comprehensive design system that establishes consistent design patterns, components, and guidelines across all products and platforms. This system serves as the foundation for creating cohesive user experiences while maintaining scalability and maintainability.

**The Challenge:** Our 3DMark ecosystem spans multiple platforms and user types: mobile apps on Android and iOS, web platforms serving both B2C and B2B users, and desktop applications across macOS, Windows, and expanding to Linux. This multi-platform complexity created inconsistent user experiences, redundant development work, and growing maintenance overhead.

**The Solution:** We developed a unified design system that provides standardized components, patterns, and guidelines. Our design system ensures consistency across all 3DMark products while enabling faster development cycles, better collaboration between teams, and improved accessibility standards. By establishing a shared design language, we have created a scalable foundation that supports our growing ecosystem while maintaining the high-quality user experience our users expect.`,m=`**Inconsistent Design Patterns & Scalability Challenges**

Our product portfolio had grown significantly, with multiple teams working on different features and platforms. This led to:

- **Inconsistent UI patterns** across different products and features
- **Duplicated design work** as teams created similar components independently
- **Maintenance overhead** when design changes needed to be applied across multiple products
- **Poor developer experience** with no standardized component library
- **Accessibility gaps** due to inconsistent implementation of design patterns

We needed a centralized design system that would provide consistent, reusable components while maintaining flexibility for different use cases.`,p=`**Research & Ideation Process**

Our design system development began with comprehensive research to understand the current state and future needs:

**Current State Analysis:**
- Audited existing UI patterns across all 3DMark products
- Identified inconsistencies in component usage and styling
- Mapped out design debt and technical constraints
- Analyzed user feedback and pain points

**Stakeholder Research:**
- Conducted interviews with designers, developers, and product managers
- Gathered requirements from different platform teams (web, mobile, desktop)
- Identified common use cases and edge cases
- Documented accessibility requirements and compliance needs

**Ideation Workshops:**
- Facilitated collaborative sessions with cross-functional teams
- Brainstormed component hierarchy and naming conventions
- Explored different documentation and implementation approaches
- Defined success metrics and adoption strategies`,u=[{image:"ideation.png",caption:"Ideation workshop outcomes showing component hierarchy and design system structure"}],g=`**Technical & Business Constraints**

**Platform Diversity:** The design system needed to work across web, mobile, and desktop applications with different technical requirements.

**Team Collaboration:** Multiple design and development teams needed to contribute to and use the system effectively.

**Performance Requirements:** Components needed to be lightweight and performant across all platforms.

**Accessibility Standards:** Full WCAG 2.1 AA compliance was required for all components.

**Backward Compatibility:** Existing products needed to be gradually migrated without breaking changes.

**Documentation Needs:** Comprehensive documentation was essential for adoption across teams.`,h=["**Component-First Architecture:** Built the system around reusable, composable components rather than page templates","**Design Token Foundation:** Established a comprehensive design token system for colors, typography, spacing, and other design values","**Accessibility-First Approach:** Made accessibility a core requirement for all components, not an afterthought","**Comprehensive Documentation:** Created detailed documentation with examples, usage guidelines, and code snippets"," **Version Control Strategy:** Implemented semantic versioning for the design system to manage breaking changes","**Design-Development Collaboration:** Established regular sync meetings between design and development teams"],y=`**Measurable Impact & Adoption Success**

**Design Consistency:** Achieved 95% consistency in UI patterns across all products, reducing design debt by 60%.

**Development Efficiency:** Component library reduced development time by 40% for new features and 70% for common UI patterns.

**Accessibility Improvement:** Achieved 100% WCAG 2.1 AA compliance across all components, improving accessibility scores by 85%.

**Team Productivity:** Design system adoption led to 50% reduction in design review cycles and 30% faster feature delivery.

**Maintenance Reduction:** Centralized components reduced maintenance overhead by 65% compared to duplicated implementations.

**Developer Satisfaction:** 90% of developers reported improved productivity and satisfaction with the standardized component library.

**Cross-Platform Consistency:** Successfully maintained consistent design language across web, mobile, and desktop applications.`,f=`**Design Philosophy & Core Principles**

Our design system is built on seven core principles that emerged from collaborative workshops with product managers, engineers, and designers. These principles guide every design decision and ensure our system serves both technical experts and newcomers to benchmarking.

**1. Accessible by Default**
We ensure inclusive design for all users by supporting keyboard navigation, screen readers, and high contrast modes. Complex technical data is presented with simple, structured explanations, especially for newcomers. The system supports language localization and provides meaningful fallback flows across platforms. UIs are designed to be self-evident, reducing cognitive load for both benchmarking newcomers and professionals.

**2. Optimized for 3D Content**
3D graphics and micro-animations are integrated as part of the experience, not decoration. They communicate meaning like progress or GPU load. We maintain high frame rates in UI environments with 3D elements and use motion and visual hierarchy to elevate technical storytelling, especially in result visualization.

**3. Unified, Yet Platform-Appropriate**
We create a consistent core visual language (components, typography, color system) that adapts appropriately to Web, Mobile, and Desktop platforms. Native design conventions are respected where necessary: touch gestures on mobile, mouse/keyboard affordances on desktop. Patterns align while allowing UI shape to reflect context.

**4. User-Centered Benchmarking**
Guidance is prioritized through onboarding flows, tooltips, and suggestions based on hardware or usage patterns. We provide comparisons, historical context, and educational layers to empower decision-making. Contextual personalization and memory features are offered, like last used benchmark or comparison history.

**5. Transparent and Trustworthy**
Data trustworthiness is ensured through transparent result reporting, historical context, and recovery options after failed runs. We minimize unnecessary user friction with fast-loading interfaces and clear system state feedback. Result-sharing is made seamless and meaningful through visuals, exports, and social sharing tools.

**6. Forward-Looking**
The system is designed with future-proofing in mind, supporting emerging use cases like AI benchmarking, hybrid workloads, or cloud streaming. It's modular, flexible, and adaptable for upcoming hardware and test types. Hooks are provided for live events, online competitions, or educational gamification to support evolving user engagement modes.

**7. Delight Through Polish**
The premium nature of 3DMark is reflected through refined UI motion, clean layouts, and professional tone. Performance is maintained across all devices: no UI lag, no jank, smooth animations. Achievements are celebrated through micro-interactions, badges, scoreboards, and sharable results.`,b=`**Core Design Tokens & Foundational Elements**

Design tokens form the atomic foundation of our system, ensuring consistency across all platforms. We chose the Design Token Format (DTF) approach for its cross-platform compatibility and developer-friendly structure.

**Why DTF for 3DMark:**

Our multi-platform ecosystem (web, iOS, Android, macOS, Windows, Linux) requires a naming convention that translates seamlessly across all environments. DTF's dot notation provides clear hierarchical structure while maintaining platform-agnostic semantics. The format works excellently with design token tools like Style Dictionary and Theo, making it easy for our development teams to parse and transform tokens for different platforms.

**Token Examples:**

\`\`\`
color.primary.500
color.neutral.100
spacing.xs
spacing.sm
typography.heading.1
typography.body.regular
border.radius.sm
shadow.elevation.1
\`\`\`

**Platform Conversions:**

**Web:**
\`\`\`css
--color-primary-500
\`\`\`
**iOS:**
\`\`\`swift
UIColor(designToken: "color.primary.500")
\`\`\`
**Android:**
\`\`\`xml
@color/primary_500
\`\`\`
**macOS:**
\`\`\`swift
NSColor(designToken: "color.primary.500")
\`\`\`
**Windows:**
\`\`\`csharp
Color.FromDesignToken("color.primary.500")
\`\`\`

This approach provides a single source of truth that scales across our entire product ecosystem while maintaining clear semantic meaning for all teams.`,v=`**WCAG Guidelines & Accessibility Standards**

Accessibility is not an afterthought but a core requirement of our design system. These standards are fundamental UX principles that ensure inclusive experiences for all users. Additionally, 3DMark follows UL Solutions design system requirements, which have strict accessibility standards that we must adhere to across all products.

**Color & Contrast:**
- All color combinations meet WCAG 2.1 AA contrast ratios
- Color is never the only way to convey information
- Focus states are clearly visible and distinct

**Typography & Readability:**
- Minimum font sizes for readability
- Adequate line spacing and letter spacing
- High contrast text on backgrounds
- Scalable text that works with browser zoom

**Keyboard Navigation:**
- All interactive elements are keyboard accessible
- Logical tab order through components
- Clear focus indicators
- Skip links for complex interfaces

**Screen Reader Support:**
- Semantic HTML structure
- Proper ARIA labels and roles
- Alternative text for images
- Descriptive link text

**Motion & Animation:**
- Respect user's motion preferences
- Provide pause/stop controls for animations
- Ensure animations don't cause seizures
- Clear loading states and progress indicators`,w=`Our typography system is designed to provide clear information hierarchy and excellent readability across all platforms. The system balances technical precision with user-friendly communication, ensuring that complex benchmarking data is presented in an accessible and professional manner.

**Font Selection:**

We chose Avenir Next Pro for headings and Open Sans for body text to create a sophisticated yet approachable typography system. Avenir Next Pro brings geometric precision and premium feel to our headings, reflecting the technical accuracy of our benchmarking tools. Open Sans provides exceptional readability for body text, especially when displaying complex technical data and performance metrics.

**Font Combination:**

This combination creates a clear visual hierarchy where Avenir Next Pro's geometric forms establish authority and professionalism in headings, while Open Sans's humanist characteristics ensure comfortable reading for extended technical content. The contrast between the geometric heading font and humanist body font helps users quickly distinguish between different content types while maintaining overall design coherence.`,k=`**Button Components & Interactive Elements**

Our button system provides consistent, accessible interactive elements that work seamlessly across all platforms. The buttons are designed to maintain visual hierarchy while ensuring clear affordances for different user actions and states.`,x=`**UI Components Library**

*Note: Detailed component documentation and examples are coming soon. Our comprehensive component library includes navigation, form, feedback, data display, interactive elements, and layout components designed for accessibility and consistency across all platforms.*`,C=`**Code Examples & Technical Implementation**

*Note: Detailed implementation guidelines, code examples, and technical documentation are coming soon. This section will include component architecture patterns, design token implementation, accessibility best practices, and responsive design patterns for our multi-platform ecosystem.*`,D={title:e,subtext:n,slug:t,banner:s,screenshots:i,appendices:a,timeSpent:o,role:r,industries:c,productName:l,summary:d,problem:m,researchIdeation:p,ideationImages:u,constraints:g,keyDecisions:h,outcomes:y,Principles:f,Fundamental:b,Accessibility:v,"Color Palette":`**Brand Colors & Color System**

Our color system provides a comprehensive palette that supports both light and dark themes, developed in collaboration with the creative director's branding identity guidelines. The dual-theme approach ensures optimal readability and visual hierarchy across all platforms while maintaining the premium feel of the 3DMark brand.`,Typography:w,Buttons:k,"Spacing & Layout":`**Grid System & Spacing Standards**

Our spacing system provides consistent layout and alignment across all components:

**Base Unit:**
- 4px base unit for all spacing calculations
- Ensures consistent scaling and alignment
- Works well with common screen densities

**Spacing Scale:**
- 4px (0.25rem) for tight spacing
- 8px (0.5rem) for component padding
- 16px (1rem) for section spacing
- 24px (1.5rem) for major sections
- 32px (2rem) for page sections
- 48px (3rem) for page margins
- 64px (4rem) for hero sections

**Grid System:**
- 12-column grid for desktop layouts
- 8-column grid for tablet layouts
- 4-column grid for mobile layouts
- Consistent gutters and margins
- Responsive breakpoints at 768px, 1024px, 1440px

**Component Spacing:**
- Consistent padding within components
- Proper margins between components
- Alignment with grid system
- Responsive spacing adjustments

**Layout Patterns:**
- Card layouts with consistent padding
- Form layouts with proper field spacing
- Navigation spacing and alignment
- Content hierarchy and visual rhythm`,Components:x,"Design Patterns":`**Design Patterns & Interaction Guidelines**

*Note: Detailed design patterns, interaction guidelines, and best practices are coming soon. This section will include common UI patterns, user interaction flows, accessibility patterns, and design principles for creating consistent and intuitive user experiences across the 3DMark ecosystem.*`,Implementation:C};export{v as Accessibility,k as Buttons,x as Components,b as Fundamental,C as Implementation,f as Principles,w as Typography,a as appendices,s as banner,g as constraints,D as default,u as ideationImages,c as industries,h as keyDecisions,y as outcomes,m as problem,l as productName,p as researchIdeation,r as role,i as screenshots,t as slug,n as subtext,d as summary,o as timeSpent,e as title};
