import React, { useEffect, useRef } from "react";

type FullBleedRowProps = {
  children: React.ReactNode;
  alignWithRef?: React.RefObject<HTMLElement>;
};

/**
 * FullBleedRow
 * - Makes its content span the full viewport width on mobile
 * - Dynamically pads the left side so inner content aligns with the page content
 */
const FullBleedRow: React.FC<FullBleedRowProps> = ({ children, alignWithRef }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const recalc = () => {
      if (!wrapperRef.current) return;
      const isMobile = window.innerWidth < 768;
      const el = wrapperRef.current;
      // Reset on desktop
      if (!isMobile) {
        el.style.marginLeft = "";
        el.style.marginRight = "";
        el.style.paddingLeft = "";
        el.style.paddingRight = "";
        el.style.width = "";
        return;
      }

      const containerEl =
        alignWithRef?.current ||
        (document.querySelector(".container-custom") as HTMLElement | null);
      if (!containerEl) return;
      const rect = containerEl.getBoundingClientRect();
      const computed = window.getComputedStyle(containerEl);
      const paddingLeft = parseFloat(computed.paddingLeft || "0");
      const leftContent = rect.left + paddingLeft; // px from viewport left to content start
      const rightGutter = Math.max(
        0,
        window.innerWidth - (rect.left + rect.width)
      );

      // Expand row to exactly viewport width and align
      el.style.width = `${window.innerWidth}px`;
      el.style.marginLeft = `-${leftContent}px`;
      el.style.marginRight = `-${rightGutter}px`;
      el.style.paddingLeft = `${leftContent}px`;
      el.style.paddingRight = `0px`; // allow touching right edge
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [alignWithRef]);

  return (
    <div ref={wrapperRef} className="fullbleed-row">
      {children}
    </div>
  );
};

export default FullBleedRow;


