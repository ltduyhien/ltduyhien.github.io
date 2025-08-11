#!/usr/bin/env node

/**
 * @fileoverview Build-time content processor for portfolio security
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONTENT_SOURCE = path.resolve(__dirname, '../private-content/projects');
const OUTPUT_DIR = path.resolve(__dirname, '../src/generated');
const IMAGES_OUTPUT_DIR = path.resolve(__dirname, '../public/project-images');
const TEMPLATE_FILE = path.resolve(__dirname, '../src/templates/content-template.ts');

console.log('🔒 Building secure content bundle...');
console.log(`📁 Source: ${CONTENT_SOURCE}`);
console.log(`📁 Output: ${OUTPUT_DIR}`);
console.log(`🖼️  Images Output: ${IMAGES_OUTPUT_DIR}`);

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

if (!fs.existsSync(IMAGES_OUTPUT_DIR)) {
  fs.mkdirSync(IMAGES_OUTPUT_DIR, { recursive: true });
}

// Read all project directories
function getProjectSlugs() {
  if (!fs.existsSync(CONTENT_SOURCE)) {
    console.warn('⚠️  Content source not found. Using fallback projects.');
    return ['nokia-data-suite', 'test-driver-cloud', 'riva-audio', '3dmark-design-system'];
  }
  
  return fs.readdirSync(CONTENT_SOURCE, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

// Process individual project data
function processProjectData(slug) {
  const projectPath = path.join(CONTENT_SOURCE, slug);
  const dataFile = path.join(projectPath, 'data.json');
  
  if (!fs.existsSync(dataFile)) {
    console.warn(`⚠️  No data.json found for ${slug}`);
    return null;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    
    // Update image paths to point to build output
    const updatedData = { ...data };
    if (updatedData.banner) {
      updatedData.banner = `/project-images/${slug}/${updatedData.banner}`;
    }
    
    // Add security metadata
    const secureData = {
      ...updatedData,
      slug,
      _security: {
        buildTime: new Date().toISOString(),
        checksum: generateChecksum(JSON.stringify(updatedData)),
        version: process.env.npm_package_version || '1.0.0'
      }
    };
    
    return secureData;
  } catch (error) {
    console.error(`❌ Error processing ${slug}:`, error.message);
    return null;
  }
}

// Generate simple checksum for data integrity
function generateChecksum(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

// Copy project images to build output
function copyProjectImages(slug) {
  const projectPath = path.join(CONTENT_SOURCE, slug);
  const projectImagesDir = path.join(IMAGES_OUTPUT_DIR, slug);
  
  // Create project images directory
  if (!fs.existsSync(projectImagesDir)) {
    fs.mkdirSync(projectImagesDir, { recursive: true });
  }
  
  // Copy all image files from project directory
  try {
    const files = fs.readdirSync(projectPath);
    const imageFiles = files.filter(file => 
      /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(file)
    );
    
    for (const imageFile of imageFiles) {
      const sourcePath = path.join(projectPath, imageFile);
      const destPath = path.join(projectImagesDir, imageFile);
      
      // Copy image file
      fs.copyFileSync(sourcePath, destPath);
      console.log(`📸 Copied: ${slug}/${imageFile}`);
    }
    
    return imageFiles.length;
  } catch (error) {
    console.warn(`⚠️  Could not copy images for ${slug}:`, error.message);
    return 0;
  }
}

// Generate content bundle
function generateContentBundle() {
  const projectSlugs = getProjectSlugs();
  const projects = {};
  const projectList = [];
  let totalImages = 0;
  
  console.log(`📋 Processing ${projectSlugs.length} projects...`);
  
  for (const slug of projectSlugs) {
    const projectData = processProjectData(slug);
    if (projectData) {
      projects[slug] = projectData;
      projectList.push({
        slug,
        title: projectData.title,
        subtext: projectData.subtext,
        industries: projectData.industries || [],
        banner: projectData.banner
      });
      console.log(`✅ Processed: ${slug}`);
      
      // Copy project images
      const imageCount = copyProjectImages(slug);
      totalImages += imageCount;
    }
  }
  
  // Generate TypeScript content bundle
  const contentBundle = `/**
 * @fileoverview Auto-generated content bundle for portfolio security
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 * @generated This file is auto-generated. Do not edit manually.
 */

import type { ProjectData } from '../pages/ProjectSingle';

// Build-time generated project data
export const PROJECTS_DATA: Record<string, ProjectData> = ${JSON.stringify(projects, null, 2)};

// Build-time generated project list
export const PROJECTS_LIST = ${JSON.stringify(projectList, null, 2)};

// Security metadata
export const CONTENT_METADATA = {
  buildTime: '${new Date().toISOString()}',
  totalProjects: ${projectList.length},
  checksum: '${generateChecksum(JSON.stringify(projects))}',
  version: '${process.env.npm_package_version || '1.0.0'}'
};

// Type-safe project getter
export function getProjectData(slug: string): ProjectData | null {
  return PROJECTS_DATA[slug] || null;
}

// Type-safe project list getter
export function getProjectsList() {
  return PROJECTS_LIST;
}

// Security validation
export function validateContentIntegrity(): boolean {
  const currentChecksum = generateChecksum(JSON.stringify(PROJECTS_DATA));
  return currentChecksum === CONTENT_METADATA.checksum;
}

// Simple checksum function (same as build-time)
function generateChecksum(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}
`;

  // Write content bundle
  const outputFile = path.join(OUTPUT_DIR, 'content-bundle.ts');
  fs.writeFileSync(outputFile, contentBundle);
  console.log(`📦 Content bundle generated: ${outputFile}`);
  
  return {
    totalProjects: projectList.length,
    totalImages,
    outputFile,
    checksum: generateChecksum(JSON.stringify(projects))
  };
}

// Main execution
try {
  const result = generateContentBundle();
  console.log('\n🎉 Content bundle build completed successfully!');
  console.log(`📊 Total projects: ${result.totalProjects}`);
  console.log(`📸 Total images copied: ${result.totalImages}`);
  console.log(`🔐 Content checksum: ${result.checksum}`);
  console.log(`📁 Output file: ${result.outputFile}`);
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
