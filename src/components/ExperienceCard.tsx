import React from "react";

import CollapsibleSection from "./CollapsibleSection";

interface ExperienceCardProps {
  title: string;
  date: string;
  children: React.ReactNode;
  expandLock?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

const ExperienceCard = ({
  title,
  date,
  children,
  expandLock = false,
  isOpen,
  onToggle,
}: ExperienceCardProps) => {
  return (
    <CollapsibleSection
      title={title}
      subtext={date}
      expandLock={expandLock}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="pb-4">{children}</div>
    </CollapsibleSection>
  );
};

export default ExperienceCard;
