/**
 * @fileoverview Anti-scraping protection for portfolio security
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

export interface ScrapingDetection {
  isBot: boolean;
  isScraper: boolean;
  riskLevel: "low" | "medium" | "high";
  userAgent: string;
  patterns: string[];
  recommendations: string[];
}

export interface AntiScrapingConfig {
  enableBotDetection: boolean;
  enablePatternDetection: boolean;
  enableBehaviorAnalysis: boolean;
  enableHoneypot: boolean;
  suspiciousPatterns: string[];
  botUserAgents: string[];
  maxRequestsPerMinute: number;
  enableCaptcha: boolean;
}

export class AntiScrapingProtection {
  private config: AntiScrapingConfig;
  private requestHistory: Map<string, { count: number; timestamps: number[] }> =
    new Map();
  private suspiciousIPs: Set<string> = new Set();

  constructor(config: Partial<AntiScrapingConfig> = {}) {
    this.config = {
      enableBotDetection: true,
      enablePatternDetection: true,
      enableBehaviorAnalysis: true,
      enableHoneypot: true,
      suspiciousPatterns: [
        "scraper",
        "crawler",
        "bot",
        "spider",
        "python",
        "curl",
        "wget",
        "httpclient",
        "requests",
        "beautifulsoup",
        "selenium",
        "puppeteer",
        "playwright",
        "headless",
        "phantomjs",
      ],
      botUserAgents: [
        "bot",
        "crawler",
        "spider",
        "scraper",
        "python",
        "curl",
        "wget",
        "httpclient",
        "requests",
        "beautifulsoup",
        "selenium",
        "puppeteer",
        "playwright",
        "headless",
        "phantomjs",
        "chrome-lighthouse",
        "googlebot",
        "bingbot",
        "slurp",
        "duckduckbot",
        "baiduspider",
        "yandexbot",
      ],
      maxRequestsPerMinute: 60,
      enableCaptcha: false,
      ...config,
    };
  }

  // Detect if request is from a bot or scraper
  detectScraping(req: Request, clientIP?: string): ScrapingDetection {
    const userAgent = req.headers.get("user-agent") || "";
    const patterns: string[] = [];
    let isBot = false;
    let isScraper = false;
    let riskLevel: "low" | "medium" | "high" = "low";

    // Bot detection
    if (this.config.enableBotDetection) {
      const lowerUA = userAgent.toLowerCase();

      // Check against known bot user agents
      for (const botPattern of this.config.botUserAgents) {
        if (lowerUA.includes(botPattern.toLowerCase())) {
          patterns.push(`Bot pattern: ${botPattern}`);
          isBot = true;
          break;
        }
      }

      // Check for suspicious patterns
      if (this.config.enablePatternDetection) {
        for (const pattern of this.config.suspiciousPatterns) {
          if (lowerUA.includes(pattern.toLowerCase())) {
            patterns.push(`Suspicious pattern: ${pattern}`);
            isScraper = true;
          }
        }
      }

      // Check for missing or generic user agents
      if (!userAgent || userAgent === "unknown" || userAgent.length < 20) {
        patterns.push("Generic or missing user agent");
        isScraper = true;
      }

      // Check for automation tools
      if (lowerUA.includes("headless") || lowerUA.includes("automation")) {
        patterns.push("Automation tool detected");
        isScraper = true;
      }
    }

    // Behavior analysis
    if (this.config.enableBehaviorAnalysis && clientIP) {
      const behavior = this.analyzeBehavior(clientIP);
      if (behavior.suspicious) {
        patterns.push(`Suspicious behavior: ${behavior.reason}`);
        isScraper = true;
      }
    }

    // Determine risk level
    if (isBot && isScraper) {
      riskLevel = "high";
    } else if (isBot || isScraper) {
      riskLevel = "medium";
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      isBot,
      isScraper,
      riskLevel,
    );

    return {
      isBot,
      isScraper,
      riskLevel,
      userAgent,
      patterns,
      recommendations,
    };
  }

  // Analyze request behavior patterns
  private analyzeBehavior(clientIP: string): {
    suspicious: boolean;
    reason: string;
  } {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;

    // Get or create request history for this IP
    let history = this.requestHistory.get(clientIP);
    if (!history) {
      history = { count: 0, timestamps: [] };
    }

    // Add current request
    history.timestamps.push(now);
    history.count++;

    // Remove old timestamps (older than 1 minute)
    history.timestamps = history.timestamps.filter(
      (timestamp) => timestamp > oneMinuteAgo,
    );
    history.count = history.timestamps.length;

    // Update history
    this.requestHistory.set(clientIP, history);

    // Check for suspicious behavior
    if (history.count > this.config.maxRequestsPerMinute) {
      this.suspiciousIPs.add(clientIP);
      return {
        suspicious: true,
        reason: `High request rate: ${history.count} requests per minute`,
      };
    }

    // Check for rapid successive requests
    if (history.timestamps.length >= 2) {
      const timeDiff =
        history.timestamps[history.timestamps.length - 1] -
        history.timestamps[history.timestamps.length - 2];
      if (timeDiff < 100) {
        // Less than 100ms between requests
        return {
          suspicious: true,
          reason: "Rapid successive requests detected",
        };
      }
    }

    return { suspicious: false, reason: "" };
  }

  // Generate security recommendations
  private generateRecommendations(
    isBot: boolean,
    isScraper: boolean,
    riskLevel: "low" | "medium" | "high",
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === "high") {
      recommendations.push("Immediate action required: Block this IP address");
      recommendations.push("Enable CAPTCHA for all requests");
      recommendations.push("Log all suspicious activity");
    } else if (riskLevel === "medium") {
      recommendations.push("Monitor this IP for suspicious behavior");
      recommendations.push("Consider rate limiting");
      recommendations.push("Enable additional logging");
    } else {
      recommendations.push("Continue monitoring");
      recommendations.push("Maintain current security measures");
    }

    if (isBot) {
      recommendations.push("Verify if this is a legitimate search engine bot");
      recommendations.push("Check robots.txt compliance");
    }

    if (isScraper) {
      recommendations.push("Consider implementing honeypot traps");
      recommendations.push("Monitor for data extraction patterns");
    }

    return recommendations;
  }

  // Add honeypot elements to HTML
  generateHoneypotElements(): string[] {
    if (!this.config.enableHoneypot) return [];

    return [
      // Hidden form field
      '<input type="text" name="website" style="position:absolute;left:-9999px;" tabindex="-1" autocomplete="off">',

      // Hidden link
      '<a href="/honeypot" style="display:none;" data-honeypot="true">Hidden link</a>',

      // Hidden div with attractive content
      '<div style="display:none;" data-honeypot="true"><h2>Admin Panel</h2><p>Username: admin</p><p>Password: password123</p></div>',

      // CSS-based honeypot
      '<div class="honeypot-hidden" style="position:absolute;left:-9999px;top:-9999px;"></div>',
    ];
  }

  // Check if IP is suspicious
  isSuspiciousIP(clientIP: string): boolean {
    return this.suspiciousIPs.has(clientIP);
  }

  // Get suspicious IPs
  getSuspiciousIPs(): string[] {
    return Array.from(this.suspiciousIPs);
  }

  // Remove IP from suspicious list
  removeSuspiciousIP(clientIP: string): void {
    this.suspiciousIPs.delete(clientIP);
  }

  // Get statistics
  getStats(): {
    totalIPs: number;
    suspiciousIPs: number;
    requestHistorySize: number;
  } {
    return {
      totalIPs: this.requestHistory.size,
      suspiciousIPs: this.suspiciousIPs.size,
      requestHistorySize: this.requestHistory.size,
    };
  }

  // Clean up old request history
  cleanup(): void {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;

    for (const [clientIP, history] of this.requestHistory.entries()) {
      // Remove old timestamps
      history.timestamps = history.timestamps.filter(
        (timestamp) => timestamp > oneMinuteAgo,
      );
      history.count = history.timestamps.length;

      // Remove IP if no recent requests
      if (history.count === 0) {
        this.requestHistory.delete(clientIP);
      }
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<AntiScrapingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): AntiScrapingConfig {
    return { ...this.config };
  }
}

// Create global anti-scraping protection instance
export const antiScraping = new AntiScrapingProtection({
  enableBotDetection: true,
  enablePatternDetection: true,
  enableBehaviorAnalysis: true,
  enableHoneypot: true,
  maxRequestsPerMinute: 60,
  enableCaptcha: false,
});

// Clean up old data every 5 minutes
setInterval(() => antiScraping.cleanup(), 5 * 60 * 1000);

export default antiScraping;
