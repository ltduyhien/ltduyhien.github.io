/**
 * @fileoverview Rate limiting and security protection for portfolio
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

// In-memory store for rate limiting (in production, use Redis or similar)
interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockExpiry: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  blockDuration: number;
  whitelist: string[];
  blacklist: string[];
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // Max requests per window
      blockDuration: 60 * 60 * 1000, // 1 hour block
      whitelist: ['localhost', '127.0.0.1'],
      blacklist: [],
      ...config
    };
  }

  // Get client identifier
  private getClientId(req: Request): string {
    // In a real implementation, you'd get this from headers, IP, etc.
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    
    // Use a combination of identifiers for better accuracy
    return `${forwarded || realIp || 'unknown'}-${userAgent}`;
  }

  // Check if request should be allowed
  checkLimit(req: Request): { allowed: boolean; remaining: number; resetTime: number; blocked: boolean } {
    const clientId = this.getClientId(req);
    const now = Date.now();

    // Check whitelist
    if (this.config.whitelist.some(ip => clientId.includes(ip))) {
      return { allowed: true, remaining: this.config.maxRequests, resetTime: now + this.config.windowMs, blocked: false };
    }

    // Check blacklist
    if (this.config.blacklist.some(ip => clientId.includes(ip))) {
      return { allowed: false, remaining: 0, resetTime: now + this.config.blockDuration, blocked: true };
    }

    // Get or create rate limit entry
    let entry = this.store.get(clientId);
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
        blocked: false,
        blockExpiry: 0
      };
    }

    // Check if currently blocked
    if (entry.blocked && now < entry.blockExpiry) {
      return { allowed: false, remaining: 0, resetTime: entry.blockExpiry, blocked: true };
    }

    // Reset block if expired
    if (entry.blocked && now >= entry.blockExpiry) {
      entry.blocked = false;
      entry.count = 0;
    }

    // Check rate limit
    if (entry.count >= this.config.maxRequests) {
      // Block the client
      entry.blocked = true;
      entry.blockExpiry = now + this.config.blockDuration;
      this.store.set(clientId, entry);
      
      return { allowed: false, remaining: 0, resetTime: entry.blockExpiry, blocked: true };
    }

    // Increment counter
    entry.count++;
    this.store.set(clientId, entry);

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
      blocked: false
    };
  }

  // Add IP to blacklist
  blacklistIP(ip: string): void {
    if (!this.config.blacklist.includes(ip)) {
      this.config.blacklist.push(ip);
    }
  }

  // Remove IP from blacklist
  whitelistIP(ip: string): void {
    this.config.blacklist = this.config.blacklist.filter(b => b !== ip);
  }

  // Get statistics
  getStats(): { totalClients: number; blockedClients: number; storeSize: number } {
    let blockedCount = 0;
    this.store.forEach(entry => {
      if (entry.blocked) blockedCount++;
    });

    return {
      totalClients: this.store.size,
      blockedClients: blockedCount,
      storeSize: this.store.size
    };
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [clientId, entry] of this.store.entries()) {
      if (now > entry.resetTime && !entry.blocked) {
        this.store.delete(clientId);
      }
    }
  }
}

// Create global rate limiter instance
export const rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 150, // 150 requests per 15 minutes
  blockDuration: 60 * 60 * 1000, // 1 hour block
  whitelist: ['localhost', '127.0.0.1', '::1'],
  blacklist: []
});

// Clean up expired entries every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

export default rateLimiter;
