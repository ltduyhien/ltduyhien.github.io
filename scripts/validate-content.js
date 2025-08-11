#!/usr/bin/env node

/**
 * @fileoverview Content validation script for portfolio security
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONTENT_BUNDLE = path.resolve(__dirname, '../src/generated/content-bundle.ts');
const PRIVATE_CONTENT = path.resolve(__dirname, '../private-content/projects');

console.log('🔍 Validating content integrity and security...');

// Check if content bundle exists
if (!fs.existsSync(CONTENT_BUNDLE)) {
  console.error('❌ Content bundle not found. Run "npm run build:content" first.');
  process.exit(1);
}

// Read and parse content bundle
function readContentBundle() {
  try {
    const content = fs.readFileSync(CONTENT_BUNDLE, 'utf8');
    
    // Extract metadata using regex (simplified parsing)
    const metadataMatch = content.match(/CONTENT_METADATA\s*=\s*({[\s\S]*?});/);
    if (!metadataMatch) {
      throw new Error('Could not parse content metadata');
    }
    
    // Extract checksum
    const checksumMatch = content.match(/checksum:\s*['"]([^'"]+)['"]/);
    const checksum = checksumMatch ? checksumMatch[1] : null;
    
    // Extract total projects
    const projectsMatch = content.match(/totalProjects:\s*(\d+)/);
    const totalProjects = projectsMatch ? parseInt(projectsMatch[1]) : 0;
    
    // Extract build time
    const buildTimeMatch = content.match(/buildTime:\s*['"]([^'"]+)['"]/);
    const buildTime = buildTimeMatch ? buildTimeMatch[1] : null;
    
    return {
      checksum,
      totalProjects,
      buildTime,
      content
    };
  } catch (error) {
    console.error('❌ Error reading content bundle:', error.message);
    return null;
  }
}

// Validate content integrity
function validateContentIntegrity(bundleData) {
  if (!bundleData) return false;
  
  console.log(`📊 Bundle metadata:`);
  console.log(`   - Total projects: ${bundleData.totalProjects}`);
  console.log(`   - Build time: ${bundleData.buildTime}`);
  console.log(`   - Checksum: ${bundleData.checksum}`);
  
  // Check if build time is recent (within last 24 hours)
  const buildDate = new Date(bundleData.buildTime);
  const now = new Date();
  const hoursSinceBuild = (now - buildDate) / (1000 * 60 * 60);
  
  if (hoursSinceBuild > 24) {
    console.warn('⚠️  Content bundle is older than 24 hours');
  }
  
  // Check if private content source exists
  if (fs.existsSync(PRIVATE_CONTENT)) {
    const privateProjects = fs.readdirSync(PRIVATE_CONTENT, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    console.log(`📁 Private content source: ${privateProjects.length} projects found`);
    
    if (privateProjects.length !== bundleData.totalProjects) {
      console.warn('⚠️  Project count mismatch between source and bundle');
      return false;
    }
  } else {
    console.log('📁 Private content source not found (using fallback)');
  }
  
  return true;
}

// Security checks
function performSecurityChecks(bundleData) {
  console.log('\n🔒 Performing security checks...');
  
  // Check for sensitive data exposure (more specific patterns)
  const sensitivePatterns = [
    /password\s*[:=]/i,
    /api_key\s*[:=]/i,
    /secret\s*[:=]/i,
    /private_key\s*[:=]/i,
    /access_token\s*[:=]/i
  ];
  
  let securityIssues = 0;
  
  for (const pattern of sensitivePatterns) {
    if (pattern.test(bundleData.content)) {
      console.warn(`⚠️  Potential sensitive data pattern found: ${pattern.source}`);
      securityIssues++;
    }
  }
  
  // Check bundle size (should be reasonable)
  const bundleSize = bundleData.content.length;
  if (bundleSize > 1000000) { // 1MB limit
    console.warn(`⚠️  Bundle size is large: ${(bundleSize / 1024 / 1024).toFixed(2)}MB`);
    securityIssues++;
  }
  
  // Check for external URLs or suspicious content
  const externalUrlPattern = /https?:\/\/[^\s"']+/g;
  const externalUrls = bundleData.content.match(externalUrlPattern) || [];
  
  if (externalUrls.length > 0) {
    console.log(`🔗 External URLs found: ${externalUrls.length}`);
    externalUrls.forEach(url => {
      // Allow legitimate project-related URLs
      const allowedDomains = [
        'localhost',
        'github.io',
        'rivaaudio.com',
        'nokia.com',
        'ul.com',
        'futuremark.com'
      ];
      
      const isAllowed = allowedDomains.some(domain => url.includes(domain));
      if (!isAllowed) {
        console.warn(`⚠️  External URL: ${url}`);
        securityIssues++;
      } else {
        console.log(`✅ Allowed external URL: ${url}`);
      }
    });
  }
  
  return securityIssues === 0;
}

// Main validation
function main() {
  console.log('🔍 Starting content validation...\n');
  
  const bundleData = readContentBundle();
  if (!bundleData) {
    process.exit(1);
  }
  
  const integrityValid = validateContentIntegrity(bundleData);
  const securityValid = performSecurityChecks(bundleData);
  
  console.log('\n📋 Validation Results:');
  console.log(`   ✅ Content integrity: ${integrityValid ? 'PASS' : 'FAIL'}`);
  console.log(`   ✅ Security checks: ${securityValid ? 'PASS' : 'FAIL'}`);
  
  if (integrityValid && securityValid) {
    console.log('\n🎉 All validation checks passed!');
    console.log('🔒 Content is secure and ready for deployment.');
  } else {
    console.log('\n❌ Validation failed. Please review the issues above.');
    process.exit(1);
  }
}

// Run validation
main();
