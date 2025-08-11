#!/usr/bin/env node

/**
 * @fileoverview Automated script to update 404.html with latest asset filenames
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license GPL v3
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');
const PUBLIC_404_PATH = path.resolve(__dirname, '../public/404.html');
const DIST_404_PATH = path.join(DIST_DIR, '404.html');

/**
 * Find the latest JavaScript and CSS assets in the dist/assets directory
 */
function findLatestAssets() {
  try {
    if (!fs.existsSync(ASSETS_DIR)) {
      console.error('❌ Assets directory not found:', ASSETS_DIR);
      console.log('💡 Make sure to run this script after building the project');
      return null;
    }

    const files = fs.readdirSync(ASSETS_DIR);
    
    // Find JavaScript files (index-*.js)
    const jsFiles = files.filter(file => 
      file.startsWith('index-') && file.endsWith('.js')
    );
    
    // Find CSS files (index-*.css)
    const cssFiles = files.filter(file => 
      file.startsWith('index-') && file.endsWith('.css')
    );

    if (jsFiles.length === 0) {
      console.error('❌ No JavaScript files found in assets directory');
      return null;
    }

    if (cssFiles.length === 0) {
      console.error('❌ No CSS files found in assets directory');
      return null;
    }

    // Get the latest files (they should be the only ones, but just in case)
    const latestJs = jsFiles[0];
    const latestCss = cssFiles[0];

    console.log(`✅ Found latest assets:`);
    console.log(`   📜 JavaScript: ${latestJs}`);
    console.log(`   🎨 CSS: ${latestCss}`);

    return {
      js: latestJs,
      css: latestCss
    };
  } catch (error) {
    console.error('❌ Error finding assets:', error.message);
    return null;
  }
}

/**
 * Update 404.html with the latest asset filenames
 */
function update404Html(assets) {
  try {
    if (!fs.existsSync(PUBLIC_404_PATH)) {
      console.error('❌ 404.html not found in public directory:', PUBLIC_404_PATH);
      return false;
    }

    // Read the current 404.html
    let content = fs.readFileSync(PUBLIC_404_PATH, 'utf8');
    
    // Update JavaScript filename
    const jsRegex = /src="\/assets\/index-[^"]+\.js"/g;
    if (jsRegex.test(content)) {
      content = content.replace(jsRegex, `src="/assets/${assets.js}"`);
      console.log(`✅ Updated JavaScript reference to: ${assets.js}`);
    } else {
      console.warn('⚠️  No JavaScript reference found to update');
    }

    // Update CSS filename
    const cssRegex = /href="\/assets\/index-[^"]+\.css"/g;
    if (cssRegex.test(content)) {
      content = content.replace(cssRegex, `href="/assets/${assets.css}"`);
      console.log(`✅ Updated CSS reference to: ${assets.css}`);
    } else {
      console.warn('⚠️  No CSS reference found to update');
    }

    // Write the updated content back to 404.html
    fs.writeFileSync(PUBLIC_404_PATH, content, 'utf8');
    console.log(`✅ Successfully updated ${PUBLIC_404_PATH}`);

    // Also copy to dist directory for deployment
    fs.copyFileSync(PUBLIC_404_PATH, DIST_404_PATH);
    console.log(`✅ Copied updated 404.html to dist directory`);

    return true;
  } catch (error) {
    console.error('❌ Error updating 404.html:', error.message);
    return false;
  }
}

/**
 * Main execution function
 */
function main() {
  console.log('🔄 Starting automated 404.html asset update...');
  console.log(`📁 Looking for assets in: ${ASSETS_DIR}`);
  
  // Find the latest assets
  const assets = findLatestAssets();
  if (!assets) {
    process.exit(1);
  }

  // Update 404.html
  const success = update404Html(assets);
  if (success) {
    console.log('🎉 404.html asset update completed successfully!');
    console.log('💡 Your 404.html now has the latest asset references');
  } else {
    console.error('❌ Failed to update 404.html');
    process.exit(1);
  }
}

// Run the script if called directly
main();
