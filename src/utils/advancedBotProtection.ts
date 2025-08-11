/**
 * @fileoverview Advanced bot protection system with behavioral analysis
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license GPL v3
 */

interface UserBehavior {
  mouseMovements: number;
  scrollEvents: number;
  clickPatterns: number[];
  timeBetweenActions: number[];
  pageInteractions: number;
  sessionDuration: number;
  navigationPattern: string[];
}

interface SecurityMetrics {
  botAttempts: number;
  blockedIPs: number;
  geographicBlocks: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  lastUpdate: number;
}

class AdvancedBotProtection {
  private userBehavior: UserBehavior;
  private securityMetrics: SecurityMetrics;
  private suspiciousPatterns: Set<string>;
  private blockedIPs: Set<string>;
  private allowedCountries: Set<string>;
  private sessionStartTime: number;

  constructor() {
    this.userBehavior = {
      mouseMovements: 0,
      scrollEvents: 0,
      clickPatterns: [],
      timeBetweenActions: [],
      pageInteractions: 0,
      sessionDuration: 0,
      navigationPattern: []
    };
    
    this.securityMetrics = {
      botAttempts: 0,
      blockedIPs: 0,
      geographicBlocks: 0,
      threatLevel: 'low',
      lastUpdate: Date.now()
    };

    this.suspiciousPatterns = new Set();
    this.blockedIPs = new Set();
    this.allowedCountries = new Set(['FI', 'US', 'CA', 'GB', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK']);
    this.sessionStartTime = Date.now();
    
    this.initializeProtection();
  }

  private initializeProtection(): void {
    this.setupEventListeners();
    this.startBehavioralAnalysis();
    this.checkGeographicLocation();
    this.loadBlockedIPs();
  }

  private setupEventListeners(): void {
    // Mouse movement tracking
    let mouseMoveCount = 0;
    let lastMouseMove = Date.now();
    
    document.addEventListener('mousemove', () => {
      mouseMoveCount++;
      const now = Date.now();
      if (now - lastMouseMove > 100) { // Debounce
        this.userBehavior.mouseMovements++;
        lastMouseMove = now;
      }
    });

    // Scroll tracking
    document.addEventListener('scroll', () => {
      this.userBehavior.scrollEvents++;
    });

    // Click pattern analysis
    document.addEventListener('click', (e) => {
      this.userBehavior.pageInteractions++;
      this.userBehavior.clickPatterns.push(Date.now());
      
      // Analyze click timing patterns
      if (this.userBehavior.clickPatterns.length > 1) {
        const timeDiff = this.userBehavior.clickPatterns[this.userBehavior.clickPatterns.length - 1] - 
                        this.userBehavior.clickPatterns[this.userBehavior.clickPatterns.length - 2];
        this.userBehavior.timeBetweenActions.push(timeDiff);
      }
    });

    // Navigation tracking
    window.addEventListener('popstate', () => {
      this.userBehavior.navigationPattern.push(window.location.pathname);
    });
  }

  private startBehavioralAnalysis(): void {
    setInterval(() => {
      this.analyzeBehavior();
      this.updateSecurityMetrics();
    }, 5000); // Analyze every 5 seconds
  }

  private analyzeBehavior(): void {
    const now = Date.now();
    this.userBehavior.sessionDuration = now - this.sessionStartTime;

    // Detect suspicious patterns
    const suspiciousIndicators = this.detectSuspiciousBehavior();
    
    if (suspiciousIndicators.length > 0) {
      this.handleSuspiciousActivity(suspiciousIndicators);
    }
  }

  private detectSuspiciousBehavior(): string[] {
    const indicators: string[] = [];

    // Too many mouse movements in short time (bot-like)
    if (this.userBehavior.mouseMovements > 1000 && this.userBehavior.sessionDuration < 10000) {
      indicators.push('excessive_mouse_movements');
    }

    // Unrealistic click timing (too fast or too regular)
    if (this.userBehavior.timeBetweenActions.length > 5) {
      const avgTime = this.userBehavior.timeBetweenActions.reduce((a, b) => a + b, 0) / this.userBehavior.timeBetweenActions.length;
      if (avgTime < 100 || avgTime > 10000) { // Less than 100ms or more than 10s between clicks
        indicators.push('suspicious_click_timing');
      }
    }

    // No mouse movements but lots of clicks (headless browser)
    if (this.userBehavior.mouseMovements < 10 && this.userBehavior.pageInteractions > 20) {
      indicators.push('headless_browser_behavior');
    }

    // Too many page interactions in short time
    if (this.userBehavior.pageInteractions > 50 && this.userBehavior.sessionDuration < 30000) {
      indicators.push('excessive_page_interactions');
    }

    return indicators;
  }

  private handleSuspiciousActivity(indicators: string[]): void {
    this.securityMetrics.botAttempts++;
    
    // Log suspicious activity
    console.warn('🚨 Suspicious activity detected:', indicators);
    
    // Update threat level
    if (this.securityMetrics.botAttempts > 10) {
      this.securityMetrics.threatLevel = 'high';
    } else if (this.securityMetrics.botAttempts > 5) {
      this.securityMetrics.threatLevel = 'medium';
    }

    // Take action based on threat level
    this.takeProtectiveAction();
  }

  private takeProtectiveAction(): void {
    switch (this.securityMetrics.threatLevel) {
      case 'medium':
        this.slowDownUserExperience();
        break;
      case 'high':
        this.blockUserAccess();
        break;
      case 'critical':
        this.emergencyShutdown();
        break;
    }
  }

  private slowDownUserExperience(): void {
    // Add artificial delays to slow down automated access
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(originalFetch.apply(window, args));
        }, Math.random() * 2000 + 1000); // 1-3 second delay
      });
    });
  }

  private blockUserAccess(): void {
    // Show warning and limit functionality
    this.showSecurityWarning();
    this.limitPageFunctionality();
  }

  private emergencyShutdown(): void {
    // Critical threat - redirect to security page
    window.location.href = '/security-alert';
  }

  private showSecurityWarning(): void {
    const warning = document.createElement('div');
    warning.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; background: #ff4444; color: white; padding: 10px; text-align: center; z-index: 10000;">
        ⚠️ Security Warning: Suspicious activity detected. Please verify you are human.
      </div>
    `;
    document.body.appendChild(warning);
  }

  private limitPageFunctionality(): void {
    // Disable certain interactions
    document.addEventListener('click', (e) => {
      if (Math.random() > 0.7) { // 30% chance to block clicks
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);
  }

  private async checkGeographicLocation(): Promise<void> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (!this.allowedCountries.has(data.country_code)) {
        this.securityMetrics.geographicBlocks++;
        this.blockGeographicAccess(data.country_code);
      }
    } catch (error) {
      console.warn('Could not determine geographic location:', error);
    }
  }

  private blockGeographicAccess(countryCode: string): void {
    console.warn(`🚫 Access blocked from country: ${countryCode}`);
    
    // Show geographic restriction message
    const restriction = document.createElement('div');
    restriction.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; background: #ff8800; color: white; padding: 10px; text-align: center; z-index: 10000;">
        🌍 Access restricted from your location (${countryCode}). This portfolio is only available in specific regions.
      </div>
    `;
    document.body.appendChild(restriction);
  }

  private loadBlockedIPs(): void {
    // Load known malicious IPs from a source (could be API or local list)
    const knownMaliciousIPs = [
      '192.168.1.100', // Example IPs
      '10.0.0.50'
    ];
    
    knownMaliciousIPs.forEach(ip => this.blockedIPs.add(ip));
  }

  private updateSecurityMetrics(): void {
    this.securityMetrics.lastUpdate = Date.now();
    
    // Emit security metrics for monitoring
    this.emitSecurityMetrics();
  }

  private emitSecurityMetrics(): void {
    const event = new CustomEvent('securityMetrics', {
      detail: this.securityMetrics
    });
    window.dispatchEvent(event);
  }

  public getSecurityMetrics(): SecurityMetrics {
    return { ...this.securityMetrics };
  }

  public getUserBehavior(): UserBehavior {
    return { ...this.userBehavior };
  }

  public isUserBlocked(): boolean {
    return this.securityMetrics.threatLevel === 'high' || this.securityMetrics.threatLevel === 'critical';
  }
}

export default AdvancedBotProtection;
