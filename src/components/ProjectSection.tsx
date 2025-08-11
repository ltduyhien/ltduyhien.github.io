/**
 * ProjectSection renders a collapsible section with markdown or custom content.
 * @param title Section title
 * @param content Markdown string or ReactNode
 * @param components ReactMarkdown components
 * @param rehypePlugins ReactMarkdown rehype plugins
 * @param isOpen Whether the section is open
 * @param onToggle Toggle handler
 */
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import type { PluggableList } from "unified";
import hljs from "highlight.js";

import CollapsibleSection from "./CollapsibleSection";

// Configure highlight.js with defensive programming
if (typeof hljs !== "undefined") {
  hljs.configure({
    ignoreUnescapedHTML: true,
  });
}

export interface ProjectSectionProps {
  title: string;
  content: string | React.ReactNode;
  components?: Record<string, unknown>;
  rehypePlugins?: PluggableList | null | undefined;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

const ProjectSection: React.FC<ProjectSectionProps> = React.memo(
  ({ title, content, components, rehypePlugins, isOpen, onToggle }) => {
    const isMarkdown = typeof content === "string";
    return (
      <CollapsibleSection title={title} isOpen={isOpen} onToggle={onToggle}>
        <div tabIndex={isOpen ? -1 : undefined} aria-live="polite">
          {isMarkdown ? (
            <ReactMarkdown
              rehypePlugins={rehypePlugins}
              components={components}
            >
              {content as string}
            </ReactMarkdown>
          ) : (
            content
          )}
        </div>
      </CollapsibleSection>
    );
  },
);

export default ProjectSection;
