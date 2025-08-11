/**
 * @fileoverview Content watermarking system for portfolio protection
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

export interface WatermarkConfig {
  enableTextWatermarking: boolean;
  enableImageWatermarking: boolean;
  enableMetadataWatermarking: boolean;
  watermarkOpacity: number;
  watermarkSize: number;
  watermarkText: string;
  watermarkColor: string;
  enableTracking: boolean;
  trackingEndpoint?: string;
}

export interface WatermarkData {
  timestamp: number;
  userId: string;
  sessionId: string;
  pageUrl: string;
  contentHash: string;
  watermarkId: string;
}

export class ContentWatermarking {
  private config: WatermarkConfig;
  private sessionId: string;
  private watermarkId: string;

  constructor(config: Partial<WatermarkConfig> = {}) {
    this.config = {
      enableTextWatermarking: true,
      enableImageWatermarking: true,
      enableMetadataWatermarking: true,
      watermarkOpacity: 0.1,
      watermarkSize: 12,
      watermarkText: '© Hien Le 2025',
      watermarkColor: '#000000',
      enableTracking: true,
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.watermarkId = this.generateWatermarkId();
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate unique watermark ID
  private generateWatermarkId(): string {
    return `wm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add invisible text watermarking to DOM elements
  addTextWatermarks(): void {
    if (!this.config.enableTextWatermarking) return;

    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
    
    textElements.forEach((element, index) => {
      if (element.textContent && element.textContent.trim().length > 10) {
        this.addTextWatermark(element as HTMLElement, index);
      }
    });

    console.log('🔒 Text watermarks applied to', textElements.length, 'elements');
  }

  // Add invisible watermark to text element
  private addTextWatermark(element: HTMLElement, index: number): void {
    const watermarkSpan = document.createElement('span');
    watermarkSpan.textContent = this.config.watermarkText;
    watermarkSpan.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      opacity: ${this.config.watermarkOpacity};
      font-size: ${this.config.watermarkSize}px;
      color: ${this.config.watermarkColor};
      pointer-events: none;
      user-select: none;
      z-index: -1;
    `;
    watermarkSpan.setAttribute('data-watermark', 'true');
    watermarkSpan.setAttribute('data-watermark-id', this.watermarkId);
    watermarkSpan.setAttribute('data-element-index', index.toString());

    element.style.position = 'relative';
    element.appendChild(watermarkSpan);
  }

  // Add invisible watermark to images
  addImageWatermarks(): void {
    if (!this.config.enableImageWatermarking) return;

    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      this.addImageWatermark(img as HTMLImageElement, index);
    });

    console.log('🔒 Image watermarks applied to', images.length, 'images');
  }

  // Add invisible watermark to image
  private addImageWatermark(img: HTMLImageElement, index: number): void {
    // Create canvas watermark
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Set canvas size to image size
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    // Create watermark text
    ctx.font = `${this.config.watermarkSize}px Arial`;
    ctx.fillStyle = this.config.watermarkColor;
    ctx.globalAlpha = this.config.watermarkOpacity;

    // Add watermark text
    const watermarkText = this.config.watermarkText;
    const textWidth = ctx.measureText(watermarkText).width;
    const x = (canvas.width - textWidth) / 2;
    const y = canvas.height - 20;

    ctx.fillText(watermarkText, x, y);

    // Convert canvas to data URL and add as background
    const watermarkDataUrl = canvas.toDataURL();
    
    // Add watermark as CSS background
    img.style.backgroundImage = `url(${watermarkDataUrl})`;
    img.style.backgroundSize = 'cover';
    img.style.backgroundPosition = 'center';
    img.style.backgroundRepeat = 'no-repeat';

    // Add watermark metadata
    img.setAttribute('data-watermark', 'true');
    img.setAttribute('data-watermark-id', this.watermarkId);
    img.setAttribute('data-element-index', index.toString());
  }

  // Add metadata watermarks to HTML
  addMetadataWatermarks(): void {
    if (!this.config.enableMetadataWatermarking) return;

    // Add watermark to document title
    const originalTitle = document.title;
    document.title = `${originalTitle} | ${this.config.watermarkText}`;

    // Add watermark to meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const originalDescription = metaDescription.getAttribute('content') || '';
      metaDescription.setAttribute('content', `${originalDescription} ${this.config.watermarkText}`);
    }

    // Add watermark to page content
    const body = document.body;
    body.setAttribute('data-watermark-id', this.watermarkId);
    body.setAttribute('data-watermark-timestamp', Date.now().toString());
    body.setAttribute('data-watermark-session', this.sessionId);

    console.log('🔒 Metadata watermarks applied');
  }

  // Add CSS-based watermarks
  addCSSWatermarks(): void {
    const style = document.createElement('style');
    style.textContent = `
      /* Invisible watermark overlay */
      .watermark-overlay::before {
        content: "${this.config.watermarkText}";
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: ${this.config.watermarkSize * 2}px;
        color: ${this.config.watermarkColor};
        opacity: ${this.config.watermarkOpacity};
        pointer-events: none;
        user-select: none;
        z-index: 9999;
        white-space: nowrap;
      }

      /* Watermark on text selection */
      ::selection {
        background: rgba(0, 0, 0, 0.1);
      }
      ::selection::after {
        content: "${this.config.watermarkText}";
        position: absolute;
        top: 0;
        right: 0;
        font-size: 10px;
        color: ${this.config.watermarkColor};
        opacity: 0.5;
      }
    `;

    document.head.appendChild(style);
    document.body.classList.add('watermark-overlay');

    console.log('🔒 CSS watermarks applied');
  }

  // Add JavaScript-based protection
  addJavaScriptProtection(): void {
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.trackProtectionEvent('right_click_blocked');
    });

    // Disable text selection on protected elements
    document.addEventListener('selectstart', (e) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-watermark')) {
        e.preventDefault();
        this.trackProtectionEvent('text_selection_blocked');
      }
    });

    // Disable drag and drop
    document.addEventListener('dragstart', (e) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-watermark') || target.tagName === 'IMG') {
        e.preventDefault();
        this.trackProtectionEvent('drag_blocked');
      }
    });

    // Disable copy operations
    document.addEventListener('copy', (e) => {
      this.trackProtectionEvent('copy_attempted');
      // Allow copy but add watermark to clipboard
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const watermarkText = `\n\n${this.config.watermarkText}`;
        e.clipboardData?.setData('text/plain', selection.toString() + watermarkText);
        e.preventDefault();
      }
    });

    // Disable print (add watermark to print)
    window.addEventListener('beforeprint', () => {
      this.trackProtectionEvent('print_attempted');
      this.addPrintWatermark();
    });

    console.log('🔒 JavaScript protection applied');
  }

  // Add watermark to print output
  private addPrintWatermark(): void {
    const printStyle = document.createElement('style');
    printStyle.textContent = `
      @media print {
        body::before {
          content: "${this.config.watermarkText}";
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 24px;
          color: #000;
          opacity: 0.3;
          z-index: 9999;
        }
      }
    `;
    document.head.appendChild(printStyle);
  }

  // Track protection events
  private trackProtectionEvent(eventType: string): void {
    if (!this.config.enableTracking) return;

    const eventData: WatermarkData = {
      timestamp: Date.now(),
      userId: this.getUserId(),
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      contentHash: this.generateContentHash(),
      watermarkId: this.watermarkId
    };

    // Send to tracking endpoint if configured
    if (this.config.trackingEndpoint) {
      this.sendTrackingData(eventData, eventType);
    }

    // Log locally
    console.log('🔒 Protection event:', eventType, eventData);
  }

  // Generate content hash for tracking
  private generateContentHash(): string {
    const content = document.body.textContent || '';
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  // Get user identifier
  private getUserId(): string {
    // Use existing user ID or generate one
    let userId = localStorage.getItem('portfolio_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('portfolio_user_id', userId);
    }
    return userId;
  }

  // Send tracking data
  private async sendTrackingData(data: WatermarkData, eventType: string): Promise<void> {
    try {
      await fetch(this.config.trackingEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          eventType,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.warn('Failed to send tracking data:', error);
    }
  }

  // Apply all watermarks
  applyAllWatermarks(): void {
    console.log('🔒 Applying content watermarks...');
    
    this.addTextWatermarks();
    this.addImageWatermarks();
    this.addMetadataWatermarks();
    this.addCSSWatermarks();
    this.addJavaScriptProtection();

    console.log('🔒 All watermarks applied successfully');
  }

  // Remove all watermarks
  removeAllWatermarks(): void {
    // Remove watermark elements
    document.querySelectorAll('[data-watermark]').forEach(el => {
      el.removeAttribute('data-watermark');
      el.removeAttribute('data-watermark-id');
      el.removeAttribute('data-element-index');
    });

    // Remove watermark classes
    document.body.classList.remove('watermark-overlay');

    // Remove watermark styles
    document.querySelectorAll('style').forEach(style => {
      if (style.textContent?.includes('watermark-overlay')) {
        style.remove();
      }
    });

    console.log('🔒 All watermarks removed');
  }

  // Get watermark statistics
  getWatermarkStats(): { textElements: number; images: number; metadata: boolean; css: boolean } {
    const textElements = document.querySelectorAll('[data-watermark]').length;
    const images = document.querySelectorAll('img[data-watermark]').length;
    const metadata = document.body.hasAttribute('data-watermark-id');
    const css = document.body.classList.contains('watermark-overlay');

    return {
      textElements,
      images,
      metadata,
      css
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<WatermarkConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): WatermarkConfig {
    return { ...this.config };
  }
}

// Create global watermarking instance
export const contentWatermarking = new ContentWatermarking({
  enableTextWatermarking: true,
  enableImageWatermarking: true,
  enableMetadataWatermarking: true,
  watermarkOpacity: 0.1,
  watermarkSize: 12,
  watermarkText: '© Hien Le 2025',
  watermarkColor: '#000000',
  enableTracking: true
});

export default contentWatermarking;
