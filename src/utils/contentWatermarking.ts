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
      watermarkOpacity: 0, // Completely invisible
      watermarkSize: 1, // Minimal size
      watermarkText: '© Hien Le 2025',
      watermarkColor: 'transparent', // Transparent color
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
      opacity: 0;
      font-size: 1px;
      color: transparent;
      pointer-events: none;
      user-select: none;
      z-index: -1;
      width: 0;
      height: 0;
      overflow: hidden;
    `;
    watermarkSpan.setAttribute('data-watermark', 'true');
    watermarkSpan.setAttribute('data-watermark-id', this.watermarkId);
    watermarkSpan.setAttribute('data-element-index', index.toString());

    // Only add position: relative if element doesn't already have positioning
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }
    element.appendChild(watermarkSpan);
  }

  // Add invisible watermark to images
  addImageWatermarks(): void {
    if (!this.config.enableImageWatermarking) return;

    const images = document.querySelectorAll('img');
    
    console.log('🔍 Found', images.length, 'images to watermark');
    
    images.forEach((img, index) => {
      console.log('🔍 Processing image', index, ':', img.src, img.alt);
      this.addImageWatermark(img as HTMLImageElement, index);
    });

    console.log('🔒 Image watermarks applied to', images.length, 'images');
  }

  // Add subtle watermark to image
  private addImageWatermark(img: HTMLImageElement, index: number): void {
    console.log('🔍 Adding watermark to image:', img.src, img.alt);
    
    // Add watermark metadata
    img.setAttribute('data-watermark', 'true');
    img.setAttribute('data-watermark-id', this.watermarkId);
    img.setAttribute('data-element-index', index.toString());
    img.setAttribute('data-watermark-text', this.config.watermarkText);
    img.setAttribute('data-watermark-timestamp', Date.now().toString());
    
    // Create a visible watermark overlay
    const watermarkOverlay = document.createElement('div');
    watermarkOverlay.textContent = this.config.watermarkText;
    watermarkOverlay.style.cssText = `
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 14px;
      font-weight: bold;
      color: #ffffff;
      background: #ff0000;
      padding: 6px 10px;
      border-radius: 6px;
      pointer-events: none;
      user-select: none;
      z-index: 999999;
      font-family: Arial, sans-serif;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 1);
      border: 2px solid #ffffff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
      min-width: 80px;
      text-align: center;
    `;
    watermarkOverlay.setAttribute('data-watermark-overlay', 'true');
    
    // Ensure image container has relative positioning
    const currentPosition = getComputedStyle(img).position;
    console.log('🔍 Image position before:', currentPosition);
    
    if (currentPosition === 'static') {
      img.style.position = 'relative';
      console.log('🔍 Changed image position to relative');
    } else {
      console.log('🔍 Image already has positioning:', currentPosition);
    }
    
    // Check for CSS conflicts
    const computedStyle = getComputedStyle(img);
    console.log('🔍 Image computed styles:', {
      overflow: computedStyle.overflow,
      clip: computedStyle.clip,
      clipPath: computedStyle.clipPath,
      transform: computedStyle.transform,
      zIndex: computedStyle.zIndex
    });
    
    // Check parent container for clipping
    const parent = img.parentElement;
    if (parent) {
      const parentStyle = getComputedStyle(parent);
      console.log('🔍 Parent container styles:', {
        overflow: parentStyle.overflow,
        clip: parentStyle.clip,
        clipPath: parentStyle.clipPath,
        position: parentStyle.position,
        zIndex: parentStyle.zIndex
      });
      
      // Check if parent has overflow hidden
      if (parentStyle.overflow === 'hidden' || parentStyle.overflow === 'clip') {
        console.log('⚠️  WARNING: Parent has overflow hidden - this will clip watermarks!');
        
        // Try to fix by changing parent overflow
        parent.style.setProperty('overflow', 'visible', 'important');
        console.log('🔧 Fixed parent overflow to visible');
      }
    }
    
    // Check all ancestor containers for clipping
    let ancestor = parent;
    let depth = 1;
    while (ancestor && depth <= 5) {
      const ancestorStyle = getComputedStyle(ancestor);
      if (ancestorStyle.overflow === 'hidden' || ancestorStyle.overflow === 'clip') {
        console.log(`⚠️  WARNING: Ancestor at depth ${depth} has overflow hidden:`, ancestor);
        console.log('🔧 Fixing ancestor overflow...');
        ancestor.style.setProperty('overflow', 'visible', 'important');
      }
      ancestor = ancestor.parentElement;
      depth++;
    }
    
                // Add watermark overlay to parent container (not to img tag)
        if (parent) {
          parent.appendChild(watermarkOverlay);
          console.log('🔍 Watermark overlay added to parent container:', parent);
          
          // Verify the watermark is in the DOM
          const addedWatermark = parent.querySelector('[data-watermark-overlay="true"]') as HTMLElement;
          if (addedWatermark) {
            console.log('✅ Watermark element verified in DOM (on parent):', addedWatermark);
            console.log('✅ Watermark styles:', addedWatermark.style.cssText);
            
            // Force visibility with !important styles
            addedWatermark.style.setProperty('display', 'block', 'important');
            addedWatermark.style.setProperty('visibility', 'visible', 'important');
            addedWatermark.style.setProperty('opacity', '1', 'important');
            addedWatermark.style.setProperty('z-index', '999999', 'important');
            
            // Debug positioning context
            console.log('🔍 Watermark positioning context:');
            console.log('  - Parent element:', parent);
            console.log('  - Parent computed styles:', getComputedStyle(parent));
            console.log('  - Watermark computed styles:', getComputedStyle(addedWatermark));
            console.log('  - Watermark bounding rect:', addedWatermark.getBoundingClientRect());
            
            console.log('✅ Forced watermark visibility with !important styles');
          } else {
            console.error('❌ Watermark element not found in DOM after adding to parent');
          }
        } else {
          console.error('❌ No parent container found for image watermark');
        }
    
    // For print: enhance watermark visibility
    img.addEventListener('beforeprint', () => {
      watermarkOverlay.style.cssText = `
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-size: 14px;
        font-weight: bold;
        color: #000;
        background: rgba(255, 255, 255, 0.9);
        padding: 5px 8px;
        border-radius: 4px;
        pointer-events: none;
        user-select: none;
        z-index: 1;
        font-family: Arial, sans-serif;
        border: 1px solid #ccc;
      `;
    });
    
    // Reset watermark after print
    img.addEventListener('afterprint', () => {
      watermarkOverlay.style.cssText = `
        position: absolute;
        bottom: 8px;
        right: 8px;
        font-size: 10px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.7);
        background: rgba(0, 0, 0, 0.6);
        padding: 3px 6px;
        border-radius: 3px;
        pointer-events: none;
        user-select: none;
        z-index: 1;
        font-family: Arial, sans-serif;
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(2px);
      `;
    });
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
      /* Non-intrusive watermark overlay - positioned off-screen */
      .watermark-overlay::before {
        content: "${this.config.watermarkText}";
        position: fixed;
        top: -9999px;
        left: -9999px;
        font-size: ${this.config.watermarkSize}px;
        color: ${this.config.watermarkColor};
        opacity: 0;
        pointer-events: none;
        user-select: none;
        z-index: -1;
        white-space: nowrap;
      }

      /* Subtle watermark on text selection - doesn't affect layout */
      ::selection {
        background: rgba(0, 0, 0, 0.05);
      }
      
      /* Hidden watermark for print only */
      @media print {
        .watermark-overlay::before {
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

    document.head.appendChild(style);
    document.body.classList.add('watermark-overlay');

    console.log('🔒 CSS watermarks applied (non-intrusive)');
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

    // Remove image watermark overlays
    const imageWatermarks = document.querySelectorAll('[data-watermark-overlay="true"]');
    imageWatermarks.forEach(watermark => watermark.remove());

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
    const images = document.querySelectorAll('[data-watermark-overlay="true"]').length;
    const metadata = document.body.hasAttribute('data-watermark-id');
    const css = document.body.classList.contains('watermark-overlay');

    return {
      textElements,
      images,
      metadata,
      css
    };
  }

  // Debug method to highlight watermarks
  debugWatermarks(): void {
    console.log('🔍 Debugging watermarks...');
    
    const imageWatermarks = document.querySelectorAll('[data-watermark-overlay="true"]');
    console.log('🔍 Found', imageWatermarks.length, 'image watermarks');
    
    imageWatermarks.forEach((watermark, index) => {
      const watermarkEl = watermark as HTMLElement;
      console.log(`🔍 Watermark ${index}:`, {
        element: watermarkEl,
        text: watermarkEl.textContent,
        styles: watermarkEl.style.cssText,
        computedStyles: getComputedStyle(watermarkEl),
        parent: watermarkEl.parentElement,
        parentStyles: watermarkEl.parentElement ? getComputedStyle(watermarkEl.parentElement) : null
      });
      
      // Try to make this watermark visible by moving it to body
      const clonedWatermark = watermarkEl.cloneNode(true) as HTMLElement;
      clonedWatermark.style.cssText = `
        position: fixed !important;
        top: ${100 + index * 60}px !important;
        left: 50px !important;
        background: #ff0000 !important;
        color: #ffffff !important;
        padding: 10px !important;
        font-size: 16px !important;
        font-weight: bold !important;
        z-index: 9999999 !important;
        border: 3px solid #ffff00 !important;
      `;
      clonedWatermark.textContent = `WATERMARK ${index}: ${watermarkEl.textContent}`;
      document.body.appendChild(clonedWatermark);
      console.log(`✅ Added visible watermark ${index} to body for testing`);
    });
    
    // Also check all images for watermark attributes
    const allImages = document.querySelectorAll('img');
    console.log('🔍 Checking all images for watermark data:');
    allImages.forEach((img, index) => {
      const imgEl = img as HTMLImageElement;
      console.log(`Image ${index}:`, {
        src: imgEl.src,
        hasWatermark: imgEl.hasAttribute('data-watermark'),
        watermarkId: imgEl.getAttribute('data-watermark-id'),
        watermarkOverlay: imgEl.querySelector('[data-watermark-overlay="true"]')
      });
    });
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
