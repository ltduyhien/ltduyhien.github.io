/**
 * ProjectNavigation renders prev/next navigation and a link to all projects.
 * @param prev Previous project (or null)
 * @param next Next project (or null)
 */
import React from "react";
import { Link } from "react-router-dom";

export interface ProjectNavItem {
  slug: string;
  title: string;
}

export interface ProjectNavigationProps {
  prev: ProjectNavItem | null;
  next: ProjectNavItem | null;
}

const ProjectNavigation: React.FC<ProjectNavigationProps> = React.memo(
  ({ prev, next }) => (
    <nav aria-label="Project navigation">
      {!prev && !next ? (
        <div className="flex justify-center mt-16 gap-4">
          <Link
            to="/projects"
            className="text-brand font-medium"
            aria-current="page"
          >
            All Projects
          </Link>
        </div>
      ) : (
        <div className="flex items-center mt-16 gap-4 relative">
          <div className="flex-1 flex justify-start">
            {prev ? (
              <Link
                to={`/projects/${prev.slug}`}
                className="flex items-center gap-2 text-brand font-medium"
              >
                <span className="text-2xl">&#8592;</span>Previous
              </Link>
            ) : (
              <span />
            )}
          </div>
          <div className="flex-1 flex justify-center">
            <Link to="/projects" className="text-brand font-medium">
              All Projects
            </Link>
          </div>
          <div className="flex-1 flex justify-end">
            {next ? (
              <Link
                to={`/projects/${next.slug}`}
                className="flex items-center gap-2 text-brand font-medium"
              >
                Next<span className="text-2xl">&#8594;</span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      )}
    </nav>
  ),
);

export default ProjectNavigation;
