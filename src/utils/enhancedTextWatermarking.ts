/**
 * @fileoverview Enhanced text watermarking with content protection features
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license GPL v3
 */

interface WatermarkConfig {
  enabled: boolean;
  text: string;
  opacity: number;
  fontSize: number;
  color: string;
  rotation: number;
  spacing: number;
  disableTextSelection: boolean;
  disableRightClick: boolean;
  disableCopy: boolean;
  invisibleWatermarks: boolean;
}

interface ProtectedElement {
  element: HTMLElement;
  originalUserSelect: string;
  originalPointerEvents: string;
}

class EnhancedTextWatermarking {
  private config: WatermarkConfig;
  private protectedElements: ProtectedElement[] = [];
  private watermarkElements: HTMLElement[] = [];
  private isActive: boolean = false;

  constructor(config?: Partial<WatermarkConfig>) {
    this.config = {
      enabled: true,
      text: '© 2025 Hien Le',
      opacity: 0.15,
      fontSize: 14,
      color: 'rgba(0, 0, 0, 0.15)',
      rotation: -12,
      spacing: 100,
      disableTextSelection: true,
      disableRightClick: true,
      disableCopy: false,
      invisibleWatermarks: true,
      ...config
    };

    this.initializeProtection();
  }

  private initializeProtection(): void {
    if (!this.config.enabled) return;

    this.isActive = true;
    
    // Apply protection after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.applyProtection());
    } else {
      this.applyProtection();
    }

    // Setup global event listeners
    this.setupGlobalProtection();
    
    // Apply watermarks
    this.applyTextWatermarks();
    
    console.log('🔒 Enhanced text watermarking initialized');
  }

  private applyProtection(): void {
    // Protect all text content
    if (this.config.disableTextSelection) {
      this.disableTextSelection();
    }

    // Protect images
    if (this.config.disableRightClick) {
      this.protectImages();
    }

    // Apply invisible watermarks
    if (this.config.invisibleWatermarks) {
      this.createInvisibleWatermarks();
    }
  }

  private disableTextSelection(): void {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li, td, th');
    
    textElements.forEach(element => {
      if (element instanceof HTMLElement) {
        const originalUserSelect = element.style.userSelect;
        const originalPointerEvents = element.style.pointerEvents;
        
        element.style.userSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.mozUserSelect = 'none';
        element.style.msUserSelect = 'none';
        element.style.pointerEvents = 'auto';
        
        // Store original values for restoration
        this.protectedElements.push({
          element,
          originalUserSelect,
          originalPointerEvents
        });
      }
    });

    // Add CSS to prevent text selection globally
    this.addGlobalCSS();
  }

  private addGlobalCSS(): void {
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      /* Allow selection for specific elements */
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      /* Disable copy shortcuts */
      body {
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
    `;
    document.head.appendChild(style);
  }

  private protectImages(): void {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      if (img instanceof HTMLImageElement) {
        // Disable right-click
        img.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.showProtectionMessage('Right-click disabled on images');
          return false;
        });

        // Disable drag and drop
        img.addEventListener('dragstart', (e) => {
          e.preventDefault();
          return false;
        });

        // Add protection overlay
        this.addImageProtectionOverlay(img);
      }
    });
  }

  private addImageProtectionOverlay(img: HTMLImageElement): void {
    const overlay = document.createElement('div');
    overlay.className = 'image-protection-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      pointer-events: none;
      z-index: 1;
    `;

    // Make image container relative for overlay positioning
    if (img.parentElement) {
      img.parentElement.style.position = 'relative';
      img.parentElement.appendChild(overlay);
    }
  }

  private applyTextWatermarks(): void {
    // Create visible watermarks
    this.createVisibleWatermarks();
    
    // Create invisible watermarks
    if (this.config.invisibleWatermarks) {
      this.createInvisibleWatermarks();
    }
  }

  private createVisibleWatermarks(): void {
    const watermarkText = this.config.text;
    const watermarkCount = Math.ceil((window.innerWidth * window.innerHeight) / (this.config.spacing * this.config.spacing));
    
    for (let i = 0; i < watermarkCount; i++) {
      const watermark = document.createElement('div');
      watermark.className = 'text-watermark';
      watermark.textContent = watermarkText;
      watermark.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        font-size: ${this.config.fontSize}px;
        color: ${this.config.color};
        opacity: ${this.config.opacity};
        transform: rotate(${this.config.rotation}deg);
        pointer-events: none;
        z-index: 9999;
        font-family: Arial, sans-serif;
        white-space: nowrap;
        user-select: none;
        z-index: -1;
      `;
      
      document.body.appendChild(watermark);
      this.watermarkElements.push(watermark);
    }
  }

  private createInvisibleWatermarks(): void {
    // Add invisible watermarks using CSS pseudo-elements
    const style = document.createElement('style');
    style.textContent = `
      .invisible-watermark::before {
        content: "© 2025 Hien Le - ${new Date().toISOString()}";
        position: absolute;
        left: -9999px;
        top: -9999px;
        font-size: 1px;
        color: transparent;
        opacity: 0;
        pointer-events: none;
        user-select: none;
        z-index: -9999;
      }
    `;
    document.head.appendChild(style);

    // Apply invisible watermarks to key elements
    const keyElements = document.querySelectorAll('h1, h2, h3, .project-title, .project-description');
    keyElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.classList.add('invisible-watermark');
      }
    });
  }

  private setupGlobalProtection(): void {
    // Disable copy shortcuts
    if (this.config.disableCopy) {
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
          e.preventDefault();
          this.showProtectionMessage('Copy function disabled');
          return false;
        }
      });
    }

    // Disable print
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        this.showProtectionMessage('Print function disabled');
        return false;
      }
    });

    // Disable save page
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        this.showProtectionMessage('Save function disabled');
        return false;
      }
    });

    // Disable view source
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        this.showProtectionMessage('Developer tools disabled');
        return false;
      }
    });

    // Disable right-click globally
    if (this.config.disableRightClick) {
      document.addEventListener('contextmenu', (e) => {
        // Allow right-click on specific elements
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
          return true;
        }
        
        e.preventDefault();
        this.showProtectionMessage('Right-click disabled');
        return false;
      });
    }
  }

  private showProtectionMessage(message: string): void {
    // Create or update protection message
    let messageElement = document.getElementById('protection-message');
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.id = 'protection-message';
      messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
      `;
      document.body.appendChild(messageElement);
    }

    messageElement.textContent = message;
    messageElement.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (messageElement) {
        messageElement.style.display = 'none';
      }
    }, 3000);
  }

  public updateConfig(newConfig: Partial<WatermarkConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.config.enabled && !this.isActive) {
      this.initializeProtection();
    } else if (!this.config.enabled && this.isActive) {
      this.disableProtection();
    } else if (this.isActive) {
      this.refreshWatermarks();
    }
  }

  public refreshWatermarks(): void {
    // Remove existing watermarks
    this.watermarkElements.forEach(element => element.remove());
    this.watermarkElements = [];
    
    // Reapply watermarks
    this.applyTextWatermarks();
  }

  public disableProtection(): void {
    this.isActive = false;
    
    // Restore text selection
    this.protectedElements.forEach(({ element, originalUserSelect, originalPointerEvents }) => {
      element.style.userSelect = originalUserSelect;
      element.style.webkitUserSelect = originalUserSelect;
      element.style.mozUserSelect = originalUserSelect;
      element.style.msUserSelect = originalUserSelect;
      element.style.pointerEvents = originalPointerEvents;
    });
    
    // Remove watermarks
    this.watermarkElements.forEach(element => element.remove());
    this.watermarkElements = [];
    
    // Remove protection message
    const messageElement = document.getElementById('protection-message');
    if (messageElement) {
      messageElement.remove();
    }
    
    console.log('🔓 Text watermarking protection disabled');
  }

  public getConfig(): WatermarkConfig {
    return { ...this.config };
  }

  public isProtectionActive(): boolean {
    return this.isActive;
  }

  public destroy(): void {
    this.disableProtection();
    this.protectedElements = [];
  }
}

export default EnhancedTextWatermarking;
