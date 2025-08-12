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
              <span className="mr-2 text-brand">•</span>
              <span>Either the link is broken</span>
            </p>
            <p className="flex items-start text-sm">
              <span className="mr-2 text-brand">•</span>
              <span>Or the page has moved</span>
            </p>
            <p className="flex items-start text-sm">
              <span className="mr-2 text-brand">•</span>
              <span>Or maybe there could be typo in the URL</span>
            </p>
          </div>
        </div>

        <div className="text-zinc-600 dark:text-zinc-400 mb-4">
          <p className="text-base">
            For now you can get back to{" "}
            <Link
              to="/"
              className="text-brand hover:text-brand/80 transition-colors duration-200"
            >
              Home page
            </Link>{" "}
            or
            <br />
            try{" "}
            <a
              href="mailto:letranduyhien@gmail.com"
              className="text-brand hover:text-brand/80 transition-colors duration-200"
            >
              Asking me
            </a>{" "}
            about the content you are looking for
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
