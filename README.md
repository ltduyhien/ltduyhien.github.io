# Hien Le - Portfolio Website

A modern, secure portfolio website built with React, TypeScript, and Tailwind CSS. Features a comprehensive project showcase with advanced security measures and content protection.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Project Showcase**: 11+ detailed project case studies with high-quality visuals
- **Responsive Design**: Mobile-first approach with smooth animations
- **Security Features**: Anti-scraping protection, rate limiting, security headers
- **Content Protection**: Invisible watermarking system for copyright protection
- **Performance**: Optimized builds with code splitting and lazy loading

## 🏗️ Architecture

- **Frontend**: React SPA with React Router for navigation
- **Styling**: Tailwind CSS with custom SCSS components
- **Build Tool**: Vite with optimized production builds
- **Deployment**: GitHub Pages with automated CI/CD
- **Content Management**: Git submodules for secure content separation

## 🔒 Security & Privacy

- **Private Content**: Sensitive project content stored in private submodules
- **Anti-Scraping**: Bot detection, rate limiting, and honeypot elements
- **Security Headers**: CSP, HSTS, X-Frame-Options, Permissions Policy
- **Content Watermarking**: Invisible copyright protection system
- **Build-Time Processing**: Content processed at build time, not exposed at runtime

## 📁 Project Structure

```
github-portfolio/
├── src/                    # React application source
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── generated/         # Build-time generated content
├── scripts/               # Build and automation scripts
├── public/                # Static assets and 404.html
├── private-content/       # Private project content (submodule)
├── private-styling/       # Private styling assets (submodule)
└── .github/workflows/     # CI/CD deployment workflows
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git with submodule support

### Setup
```bash
# Clone with submodules
git clone --recursive https://github.com/ltduyhien/ltduyhien.github.io.git
cd ltduyhien.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build
```bash
# Build content and application
npm run build

# Preview production build
npm run preview
```

## 📊 Content Management

The portfolio uses a sophisticated content management system:

- **Private Submodules**: Content and styling stored in separate private repositories
- **Build-Time Processing**: Content processed and bundled during build
- **Asset Optimization**: Images automatically copied and optimized
- **Content Bundle**: Generated TypeScript bundle for type-safe content access

## 🚀 Deployment

- **Automated CI/CD**: GitHub Actions workflow for deployment
- **GitHub Pages**: Hosted on GitHub Pages with SPA routing support
- **Asset Management**: Automated 404.html asset updates
- **Submodule Handling**: Secure submodule cloning in CI environment

## 📝 License

**Copyright (c) 2025 Hien Le. Licensed under GPL v3.**

This project is open source software licensed under the GNU General Public License v3.0.

## 🔗 Links

- **Live Site**: [https://ltduyhien.github.io](https://ltduyhien.github.io)
- **Main Repository**: [https://github.com/ltduyhien/ltduyhien.github.io](https://github.com/ltduyhien/ltduyhien.github.io)

---

*Built with ❤️ and modern web technologies*
