import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";

interface ConsoleBlockProps {
  code: string;
  response: string;
  codeLang?: string;
  responseLang?: string;
}

const ConsoleBlock: React.FC<ConsoleBlockProps> = ({
  code,
  response,
  codeLang = "",
  responseLang = "",
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const responseRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
      // Fallback: force re-highlighting
      codeRef.current.classList.add("hljs");
    }
    if (responseRef.current) {
      hljs.highlightElement(responseRef.current);
      responseRef.current.classList.add("hljs");
    }
  }, [code, response, codeLang, responseLang]);

  return (
    <div className="overflow-hidden w-full my-8 [border-radius:6px_/_6px] border border-zinc-200 dark:border-0">
      {/* Code Block */}
      <div>
        <pre
          className="mb-0 w-full max-w-full overflow-x-auto rounded-none"
          style={{ borderRadius: 0 }}
        >
          <code
            ref={codeRef}
            className={
              (codeLang ? `language-${codeLang}` : "") +
              " bg-white text-zinc-800 dark:bg-zinc-900 dark:text-inherit p-4 text-sm block whitespace-pre font-medium"
            }
            style={{ borderRadius: 0 }}
          >
            {code}
          </code>
        </pre>
      </div>
      {/* Custom separator */}
      <div className="h-px w-full bg-zinc-200 dark:bg-[rgba(255,255,255,0.08)]"></div>
      <div>
        <pre
          className="mb-0 w-full max-w-full overflow-x-auto rounded-none"
          style={{ borderRadius: 0 }}
        >
          <code
            ref={responseRef}
            className={
              (responseLang ? `language-${responseLang}` : "") +
              " bg-white text-zinc-800 dark:bg-zinc-900 dark:text-inherit p-4 text-sm block whitespace-pre font-medium"
            }
            style={{ borderRadius: 0 }}
          >
            {response}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default ConsoleBlock;
