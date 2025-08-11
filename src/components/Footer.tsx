/**
 * @fileoverview Footer component for Hien Le's portfolio
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { trackLinkedInClick, trackEmailClick, trackCVDownload } from '../utils/analytics';

const Footer = () => {
  return (
    <div className="mt-16">
      <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">
        Thanks for visiting :)
      </h3>
      <p className="text-base font-medium text-zinc-700 dark:text-zinc-200">
        You can get in touch with me by{' '}
        <a
          href="https://www.linkedin.com/in/hienl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand hover:underline"
          onClick={trackLinkedInClick}
        >
          Connecting
        </a>{' '}
        with me in LinkedIn,{' '}
        <a 
          href="/cv_hien.pdf" 
          download
          className="text-brand hover:underline"
          onClick={trackCVDownload}
        >
          Downloading
        </a>{' '}
        my CV, or{' '}
        <a 
          href="mailto:letranduyhien@gmail.com" 
          className="text-brand hover:underline"
          onClick={trackEmailClick}
        >
          Sending
        </a>{' '}
        me Email.
      </p>
      <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-left">
          © 2025 Hien Le. All rights reserved. This portfolio is licensed under the MIT License.
        </p>
      </div>
    </div>
  );
};

export default Footer; 