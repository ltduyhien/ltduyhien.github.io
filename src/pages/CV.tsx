import React from "react";

import Footer from "../components/Footer";
import { useScrollToTop } from "../hooks/useScrollToTop";

const CV = () => {
  // Smooth scroll to top when navigating to CV page
  useScrollToTop({
    autoScroll: true,
    behavior: "smooth",
    delay: 100,
  });

  return (
    <div className="container-custom px-8 pt-24 pb-16 md:py-16 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
        Looking to learn more about my work and experience?
      </h2>
      <p className="mb-2 text-base font-medium text-zinc-700 dark:text-zinc-200 leading-relaxed">
        You can download my full CV below for a detailed look at the roles I've
        held, the projects I've led, and the impact I've made.
      </p>
      <p className="mb-8 text-base font-medium text-zinc-700 dark:text-zinc-200 leading-relaxed">
        If you think my background could be a good fit for your team or project,
        I’d love to hear from you. Whether it's a full-time opportunity,
        freelance collaboration, or something in between—feel free to reach out!
      </p>
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <a
          href="/cv_hien.pdf"
          download
          className="inline-flex items-center justify-center bg-brand text-white dark:text-black font-medium text-base px-6 [border-radius:4px_/_4px] w-full md:w-auto"
          style={{ height: 42, fontSize: 16 }}
        >
          Download my CV
        </a>
        <a
          href="mailto:letranduyhien@gmail.com"
          className="inline-flex items-center justify-center bg-zinc-600 dark:bg-zinc-700 text-white font-medium text-base px-6 [border-radius:4px_/_4px] w-full md:w-auto"
          style={{ height: 42, fontSize: 16 }}
        >
          Contact Me
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default CV;
