/**
 * Utility to format the summary and bold the project name/productName if present.
 * @param summary The summary string
 * @param name The project name or productName to bold
 * @returns JSX.Element
 */
import React from "react";

export function formatSummary(summary: string, name: string): JSX.Element {
  if (!name) return <>{summary}</>;
  // Escape special regex characters in name
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedName})`, "g");
  const parts = summary.split(regex);
  return (
    <>
      {parts.map((part, idx) =>
        part === name ? (
          <span key={idx} className="font-bold">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
