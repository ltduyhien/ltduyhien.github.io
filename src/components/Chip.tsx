import React from "react";

type ChipProps = {
  text: string;
};

const Chip = ({ text }: ChipProps) => (
  <span className="inline-block px-3 py-1 text-base md:text-sm font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-750 border border-zinc-200 dark:border-zinc-750 [border-radius:4px_/_4px] whitespace-nowrap">
    {text}
  </span>
);

export default Chip;
