# Environment Variables Setup

This document explains how to configure environment variables for your portfolio.

## 🔒 **Security Notice**

- **NEVER commit `.env` files to git** - they contain sensitive information
- **Use `.env.example` as a template** - it contains no real secrets
- **Environment files are already in `.gitignore`** - they won't be tracked

## 📁 **Environment Files**

### **Development (`.env`)**
```bash
# Copy env.example to .env and fill in your values
cp env.example .env
```

### **Production (`.env.production`)**
```bash
# Copy env.production to .env.production and fill in your values
cp env.production .env.production
```

## ⚙️ **Configuration Variables**

### **Portfolio Settings**
```bash
VITE_PORTFOLIO_TITLE="Hien Le | Product Designer Portfolio"
VITE_PORTFOLIO_DESCRIPTION="Senior/Lead Product Designer based in Espoo, Finland"
VITE_PORTFOLIO_LOCATION="Espoo, Finland"
VITE_PORTFOLIO_COMPANY="UL Solutions"
```

### **Analytics Configuration**
```bash
# Replace with your actual Google Analytics ID
VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
VITE_GA_ENABLED="true"
```

### **Feature Flags**
```bash
VITE_ENABLE_ANALYTICS="true"
VITE_ENABLE_DARK_MODE="true"
VITE_ENABLE_PROJECT_NAVIGATION="true"
```

### **Security Settings**
```bash
VITE_CONTENT_SOURCE="submodule"
VITE_STYLING_SOURCE="submodule"
VITE_MAX_PROJECTS_PER_PAGE="20"
```

## 🚀 **Usage in Code**

```typescript
import { CONFIG } from './utils/config';

// Access configuration
const title = CONFIG.portfolio.title;
const analyticsEnabled = CONFIG.analytics.enabled;
const maxProjects = CONFIG.security.maxProjectsPerPage;
```

## 🔧 **Build Commands**

### **Development**
```bash
npm run dev
# Uses .env file
```

### **Production Build**
```bash
npm run build
# Uses .env.production file
```

### **Preview Production**
```bash
npm run preview
# Uses .env.production file
```

## 🛡️ **Security Benefits**

1. **Configuration Separation**: Different settings for dev/prod
2. **Secret Protection**: Sensitive data not in source code
3. **Environment Isolation**: Dev and prod configurations separate
4. **Build-time Injection**: Variables injected during build process

## 📝 **Example Setup**

1. **Copy template files**:
   ```bash
   cp env.example .env
   cp env.production .env.production
   ```

2. **Edit `.env`** with your development values
3. **Edit `.env.production`** with your production values
4. **Restart dev server** to load new environment variables

## ⚠️ **Troubleshooting**

- **Environment variables not loading?** Restart your dev server
- **Build errors?** Check that all required variables are set
- **Analytics not working?** Verify `VITE_GA_MEASUREMENT_ID` is set correctly
