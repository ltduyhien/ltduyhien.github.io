#!/usr/bin/env node

/**
 * @fileoverview Script to automatically generate 404.html from NotFound.tsx
 * This ensures both pages stay in sync automatically
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the NotFound.tsx component
const notFoundPath = path.join(__dirname, '../src/pages/NotFound.tsx');
const outputPath = path.join(__dirname, '../public/404.html');

try {
  const notFoundContent = fs.readFileSync(notFoundPath, 'utf8');
  
  // Extract the JSX content from NotFound.tsx
  // Look for the return statement content
  const jsxMatch = notFoundContent.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
  
  if (!jsxMatch) {
    throw new Error('Could not find JSX content in NotFound.tsx');
  }
  
  let jsxContent = jsxMatch[1];
  
  // Convert JSX to HTML
  // Remove React-specific attributes and convert to plain HTML
  jsxContent = jsxContent
    // Convert className to class
    .replace(/className=/g, 'class=')
    // Remove motion.div and convert to regular div
    .replace(/<motion\.div/g, '<div')
    .replace(/<\/motion\.div>/g, '</div>')
    // Remove motion props
    .replace(/\s+initial=\{[\s\S]*?\}/g, '')
    .replace(/\s+animate=\{[\s\S]*?\}/g, '')
    .replace(/\s+transition=\{[\s\S]*?\}/g, '')
    // Convert Link to anchor tag
    .replace(/<Link\s+to="([^"]+)"/g, '<a href="$1"')
    .replace(/<\/Link>/g, '</a>')
    // Remove React fragments
    .replace(/<>/g, '')
    .replace(/<\/>/g, '')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  // Create the 404.html file
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Hien Le - Portfolio</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Load the main app assets -->
  <script type="module" crossorigin src="/assets/index-DIICp0EI.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-FMrqBOm1.css">
  
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    // This script takes the current url and converts the path and query
    // string into just a query string, and then redirects the browser
    // to the new url with only a query string and hash fragment.
    var pathSegmentsToKeep = 0;

    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      (l.hash ? '&' + l.hash.slice(1).replace(/&/g, '~and~') : '')
    );
  </script>
</head>
<body>
  <div id="root">
    <!-- Static 404 content that matches NotFound.tsx -->
    <div class="w-fit mx-auto px-8 pt-28 pb-16 md:py-28">
      <div>
        <h1 class="text-lg font-bold mb-6 text-zinc-900 dark:text-white leading-tight">
          Sorry, the link you are looking for is not found!
        </h1>

        <div class="text-zinc-600 dark:text-zinc-400 mb-6">
          <p class="text-base mb-3">Possible reasons:</p>
          <div class="space-y-2 ml-4">
            <p class="flex items-start text-sm">
              <span class="mr-2 text-brand">•</span>
              <span>Either the link is broken</span>
            </p>
            <p class="flex items-start text-sm">
              <span class="mr-2 text-brand">•</span>
              <span>Or the page has moved</span>
            </p>
            <p class="flex items-start text-sm">
              <span class="mr-2 text-brand">•</span>
              <span>Or maybe there could be typo in the URL</span>
            </p>
          </div>
        </div>

        <div class="text-zinc-600 dark:text-zinc-400 mb-4">
          <p class="text-base">
            For now you can get back to 
            <a href="/" class="text-brand hover:text-brand/80 transition-colors duration-200">
              Home page
            </a> 
            or
            <br />
            try 
            <a href="mailto:letranduyhien@gmail.com" class="text-brand hover:text-brand/80 transition-colors duration-200">
              Asking me
            </a> 
            about the content you are looking for
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(outputPath, htmlContent, 'utf8');
  
  console.log('✅ Successfully generated 404.html from NotFound.tsx');
  console.log('📁 Output file:', outputPath);
  
} catch (error) {
  console.error('❌ Error generating 404.html:', error.message);
  process.exit(1);
}
