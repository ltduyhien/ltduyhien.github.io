/**
 * @fileoverview Security headers manager for portfolio protection
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

export interface SecurityHeaders {
  [key: string]: string;
}

export interface SecurityConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  enableFrameOptions: boolean;
  enableReferrerPolicy: boolean;
  enablePermissionsPolicy: boolean;
  enableXSSProtection: boolean;
  enableContentTypeOptions: boolean;
  enableDNSPrefetch: boolean;
}

export class SecurityHeadersManager {
  private config: SecurityConfig;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = {
      enableCSP: true,
      enableHSTS: true,
      enableFrameOptions: true,
      enableReferrerPolicy: true,
      enablePermissionsPolicy: true,
      enableXSSProtection: true,
      enableContentTypeOptions: true,
      enableDNSPrefetch: false,
      ...config
    };
  }

  // Generate Content Security Policy
  private generateCSP(): string {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' data: https:",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ];

    return cspDirectives.join('; ');
  }

  // Generate Permissions Policy
  private generatePermissionsPolicy(): string {
    const permissions = [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
      'ambient-light-sensor=()',
      'autoplay=()',
      'encrypted-media=()',
      'picture-in-picture=()',
      'publickey-credentials-get=()',
      'screen-wake-lock=()',
      'sync-xhr=()',
      'web-share=()'
    ];

    return permissions.join(', ');
  }

  // Get all security headers
  getHeaders(): SecurityHeaders {
    const headers: SecurityHeaders = {};

    // Content Security Policy
    if (this.config.enableCSP) {
      headers['Content-Security-Policy'] = this.generateCSP();
    }

    // HTTP Strict Transport Security
    if (this.config.enableHSTS) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    // X-Frame-Options
    if (this.config.enableFrameOptions) {
      headers['X-Frame-Options'] = 'DENY';
    }

    // X-Content-Type-Options
    if (this.config.enableContentTypeOptions) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    // X-XSS-Protection
    if (this.config.enableXSSProtection) {
      headers['X-XSS-Protection'] = '1; mode=block';
    }

    // Referrer Policy
    if (this.config.enableReferrerPolicy) {
      headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    }

    // Permissions Policy
    if (this.config.enablePermissionsPolicy) {
      headers['Permissions-Policy'] = this.generatePermissionsPolicy();
    }

    // DNS Prefetch Control
    if (this.config.enableDNSPrefetch) {
      headers['X-DNS-Prefetch-Control'] = 'on';
    } else {
      headers['X-DNS-Prefetch-Control'] = 'off';
    }

    // Additional security headers
    headers['X-Permitted-Cross-Domain-Policies'] = 'none';
    headers['X-Download-Options'] = 'noopen';
    headers['X-Powered-By'] = 'Hien Le Portfolio';

    return headers;
  }

  // Get headers as meta tags for HTML
  getMetaTags(): string[] {
    const metaTags: string[] = [];
    const headers = this.getHeaders();

    // Convert CSP to meta tag
    if (headers['Content-Security-Policy']) {
      metaTags.push(`<meta http-equiv="Content-Security-Policy" content="${headers['Content-Security-Policy']}">`);
    }

    // Convert other security headers to meta tags
    if (headers['X-Frame-Options']) {
      metaTags.push(`<meta http-equiv="X-Frame-Options" content="${headers['X-Frame-Options']}">`);
    }

    if (headers['X-Content-Type-Options']) {
      metaTags.push(`<meta http-equiv="X-Content-Type-Options" content="${headers['X-Content-Type-Options']}">`);
    }

    if (headers['X-XSS-Protection']) {
      metaTags.push(`<meta http-equiv="X-XSS-Protection" content="${headers['X-XSS-Protection']}">`);
    }

    if (headers['Referrer-Policy']) {
      metaTags.push(`<meta name="referrer" content="${headers['Referrer-Policy']}">`);
    }

    return metaTags;
  }

  // Validate headers configuration
  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.config.enableHSTS && !this.config.enableCSP) {
      errors.push('HSTS should be enabled with CSP for maximum security');
    }

    if (this.config.enableCSP && !this.config.enableFrameOptions) {
      errors.push('CSP should be enabled with X-Frame-Options for frame protection');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    const validation = this.validateConfig();
    if (!validation.valid) {
      console.warn('Security configuration warnings:', validation.errors);
    }
  }

  // Get current configuration
  getConfig(): SecurityConfig {
    return { ...this.config };
  }
}

// Create global security headers manager
export const securityHeaders = new SecurityHeadersManager({
  enableCSP: true,
  enableHSTS: true,
  enableFrameOptions: true,
  enableReferrerPolicy: true,
  enablePermissionsPolicy: true,
  enableXSSProtection: true,
  enableContentTypeOptions: true,
  enableDNSPrefetch: false
});

export default securityHeaders;
