/**
 * @fileoverview License page component for Hien Le's portfolio
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license GPL v3
 */

import React from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import { useScrollToTop } from "../hooks/useScrollToTop";

const License: React.FC = () => {
  // Smooth scroll to top when navigating to License page
  useScrollToTop({
    autoScroll: true,
    behavior: "smooth",
    delay: 100,
  });

  return (
    <div className="container-custom px-8 pt-24 pb-16 md:pt-8 md:pb-16">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white leading-relaxed">
          License
        </h1>
        <p className="text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
          This portfolio website and its development are licensed under the GNU
          General Public License v3.0.{" "}
          <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
            The projects showcased here represent my work experience at various
            companies and are not part of this open source license.
          </span>
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-8 mb-8">
        <h2 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">
          GNU General Public License v3.0
        </h2>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            Copyright (c) 2025 Hien Le
          </p>

          <p className="text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            This program is free software: you can redistribute it and/or modify
            it under the terms of the GNU General Public License as published by
            the Free Software Foundation, either version 3 of the License, or
            (at your option) any later version.
          </p>

          <p className="text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            This program is distributed in the hope that it will be useful, but
            WITHOUT ANY WARRANTY; without even the implied warranty of
            MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
            General Public License for more details.
          </p>

          <p className="text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
            You should have received a copy of the GNU General Public License
            along with this program. If not, see{" "}
            <a
              href="https://www.gnu.org/licenses/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              https://www.gnu.org/licenses/
            </a>
            .
          </p>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">
          What This Means
        </h3>
        <ul className="text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-2">
          <li className="flex items-start">
            <span className="mr-2 text-brand">•</span>
            <span>You are free to use, modify, and distribute this code</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-brand">•</span>
            <span>Any derivative works must also be licensed under GPL v3</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-brand">•</span>
            <span>Source code must be made available when distributing</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-brand">•</span>
            <span>Commercial use is permitted under these terms</span>
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center text-brand hover:text-brand/80 transition-colors duration-200 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default License;
