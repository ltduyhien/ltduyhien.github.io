import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  return (
    <div className="w-fit mx-auto px-8 pt-28 pb-16 md:py-28">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white leading-tight">
          Sorry, the link you are looking for is not found!
        </h1>

        <div className="text-zinc-600 dark:text-zinc-400 mb-6">
          <p className="text-base mb-3">Possible reasons:</p>
          <div className="space-y-2 ml-4">
            <p className="flex items-start text-sm">
              <span className="mr-2">•</span>
              <span>Either the link is broken</span>
            </p>
            <p className="flex items-start text-sm">
              <span className="mr-2">•</span>
              <span>Or the page has moved</span>
            </p>
            <p className="flex items-start text-sm">
              <span className="mr-2">•</span>
              <span>Or maybe there could be typo in the URL</span>
            </p>
          </div>
        </div>

        <div className="text-zinc-600 dark:text-zinc-400 mb-4">
          <p className="text-base">For now we can try to:</p>
        </div>

        <div className="space-y-2 ml-4">
          <Link
            to="/"
            className="flex items-start text-brand hover:text-brand/80 transition-colors duration-200 text-sm"
          >
            <span className="mr-2">•</span>
            <span>Back to homepage</span>
          </Link>
          <a
            href="mailto:letranduyhien@gmail.com"
            className="flex items-start text-brand hover:text-brand/80 transition-colors duration-200 text-sm"
          >
            <span className="mr-2">•</span>
            <span>Contact me for the content you are looking for</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
