#!/usr/bin/env node

/**
 * @fileoverview Auto-fetch private repositories for local development
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license GPL v3
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const PRIVATE_REPOS = [
  {
    name: 'private-content',
    url: 'https://github.com/ltduyhien/portfolio-private-content.git',
    branch: 'main'
  },
  {
    name: 'private-styling',
    url: 'https://github.com/ltduyhien/portfolio-private-styling.git',
    branch: 'main'
  }
];

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'     // Reset
  };
  
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function checkGitAccess() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function fetchPrivateRepo(repo) {
  const repoPath = path.join(projectRoot, repo.name);
  
  try {
    if (fs.existsSync(repoPath)) {
      log(`📁 ${repo.name} exists, updating...`, 'info');
      
      // Update existing repo
      execSync(`cd "${repoPath}" && git fetch origin && git reset --hard origin/${repo.branch}`, {
        stdio: 'inherit',
        cwd: repoPath
      });
      
      log(`✅ ${repo.name} updated successfully`, 'success');
    } else {
      log(`📥 Cloning ${repo.name}...`, 'info');
      
      // Clone new repo
      execSync(`git clone -b ${repo.branch} ${repo.url} "${repoPath}"`, {
        stdio: 'inherit',
        cwd: projectRoot
      });
      
      log(`✅ ${repo.name} cloned successfully`, 'success');
    }
    
    return true;
  } catch (error) {
    log(`❌ Failed to fetch ${repo.name}: ${error.message}`, 'error');
    return false;
  }
}

function main() {
  log('🚀 Starting private repository fetch...', 'info');
  
  if (!checkGitAccess()) {
    log('❌ Git is not available. Please install Git first.', 'error');
    process.exit(1);
  }
  
  let successCount = 0;
  let totalCount = PRIVATE_REPOS.length;
  
  for (const repo of PRIVATE_REPOS) {
    if (fetchPrivateRepo(repo)) {
      successCount++;
    }
  }
  
  if (successCount === totalCount) {
    log(`🎉 All private repositories fetched successfully! (${successCount}/${totalCount})`, 'success');
    log('💡 You can now run "npm run dev" with full content access', 'info');
  } else {
    log(`⚠️  Some repositories failed to fetch (${successCount}/${totalCount})`, 'warning');
    log('💡 Check your GitHub access and try again', 'info');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;
