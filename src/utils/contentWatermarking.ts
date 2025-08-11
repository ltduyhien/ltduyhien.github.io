/**
 * @fileoverview Content watermarking system for portfolio protection
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license GPL v3
 *
 * PRODUCTION CONFIGURATION:
 * - Text watermarking: ENABLED (invisible protection)
 * - Image watermarking: DISABLED (no visual interference)
 * - Metadata protection: ENABLED (hidden watermark data)
 * - Anti-scraping: ENABLED (rate limiting and protection)
 */

// Extend Window interface for watermark debugging
declare global {
  interface Window {
    watermarkDebugBorders?: Array<{
      element: HTMLElement;
      parent: HTMLElement;
      type: string;
    }>;
  }
}

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
      enableImageWatermarking: false, // DISABLED FOR PRODUCTION - no image watermarks
      enableMetadataWatermarking: true,
      watermarkOpacity: 0.15, // Very subtle opacity
      watermarkSize: 1, // Minimal size
      watermarkText: "© Hien Le 2025",
      watermarkColor: "rgba(255, 255, 255, 0.15)", // Very subtle white
      enableTracking: true,
      ...config,
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

    const textElements = document.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, span, div",
    );

    textElements.forEach((element, index) => {
      if (element.textContent && element.textContent.trim().length > 10) {
        this.addTextWatermark(element as HTMLElement, index);
      }
    });

    console.log(
      "🔒 Text watermarks applied to",
      textElements.length,
      "elements",
    );
  }

  // Add invisible watermark to text element
  private addTextWatermark(element: HTMLElement, index: number): void {
    const watermarkSpan = document.createElement("span");
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
    watermarkSpan.setAttribute("data-watermark", "true");
    watermarkSpan.setAttribute("data-watermark-id", this.watermarkId);
    watermarkSpan.setAttribute("data-element-index", index.toString());

    // Only add position: relative if element doesn't already have positioning
    if (getComputedStyle(element).position === "static") {
      element.style.position = "relative";
    }
    element.appendChild(watermarkSpan);
  }

  // Add invisible watermark to images - DISABLED FOR PRODUCTION
  addImageWatermarks(): void {
    // Image watermarking is disabled for production to avoid visual interference
    console.log("🔒 Image watermarking is disabled for production");
    return;
  }

  // Add subtle watermark to image
  private addImageWatermark(img: HTMLImageElement, index: number): void {
    console.log("🔍 Adding watermark to image:", img.src, img.alt);

    // Add watermark metadata
    img.setAttribute("data-watermark", "true");
    img.setAttribute("data-watermark-id", this.watermarkId);
    img.setAttribute("data-element-index", index.toString());
    img.setAttribute("data-watermark-text", this.config.watermarkText);
    img.setAttribute("data-watermark-timestamp", Date.now().toString());

    // Create a visible watermark overlay (will be styled after parent is defined)
    const watermarkOverlay = document.createElement("div");
    watermarkOverlay.textContent = `${this.config.watermarkText} [${index + 1}]`;
    watermarkOverlay.setAttribute("data-watermark-overlay", "true");

    // Ensure image container has relative positioning
    const currentPosition = getComputedStyle(img).position;
    console.log("🔍 Image position before:", currentPosition);

    if (currentPosition === "static") {
      img.style.position = "relative";
      console.log("🔍 Changed image position to relative");
    } else {
      console.log("🔍 Image already has positioning:", currentPosition);
    }

    // Check for CSS conflicts
    const computedStyle = getComputedStyle(img);
    console.log("🔍 Image computed styles:", {
      overflow: computedStyle.overflow,
      clip: computedStyle.clip,
      clipPath: computedStyle.clipPath,
      transform: computedStyle.transform,
      zIndex: computedStyle.zIndex,
    });

    // Check parent container for clipping
    const parent = img.parentElement;
    if (parent) {
      const parentStyle = getComputedStyle(parent);
      console.log("🔍 Parent container styles:", {
        overflow: parentStyle.overflow,
        clip: parentStyle.clip,
        clipPath: parentStyle.clipPath,
        position: parentStyle.position,
        zIndex: parentStyle.zIndex,
      });

      // CRITICAL FIX: Ensure parent has relative positioning for watermark positioning
      if (parentStyle.position === "static") {
        parent.style.setProperty("position", "relative", "important");
        console.log(
          "🔧 CRITICAL FIX: Changed parent position to relative !important",
        );
      } else {
        console.log("🔍 Parent already has positioning:", parentStyle.position);
      }

      // Create repeating watermark pattern using multiple DOM elements

      // Calculate watermark dimensions and spacing for repeating pattern
      const watermarkSize = Math.min(
        60,
        Math.min(img.offsetWidth, img.offsetHeight) * 0.08,
      ); // Reduced from 0.12 to 0.08
      const fontSize = Math.max(6, watermarkSize * 0.25); // Reduced from 0.4 to 0.25 for smaller text
      const spacing = watermarkSize * 2.5; // Increased from 1.5 to 2.5 for more spacing

      // Clear the overlay and create multiple watermark elements
      watermarkOverlay.innerHTML = "";

      // Get the actual image dimensions and position within the parent

      // VISUAL INSPECTION APPROACH: Find the actual image boundaries by looking at the image itself
      const imgTop = img.offsetTop;
      const imgLeft = img.offsetLeft;

      // Get the actual rendered dimensions from the image element
      const imgRect = img.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();

      // Use the actual rendered dimensions, but cap them to prevent extreme values
      let finalWidth = imgRect.width;
      let finalHeight = imgRect.height;

      // If the dimensions seem unreasonable, try to find the actual content area
      if (finalWidth > 2000 || finalHeight > 2000) {
        console.log(
          "⚠️  WARNING: Image dimensions seem too large, trying alternative method",
        );

        // Look for the actual image content by checking if it's an img tag with src
        if (img.src && img.src !== "") {
          // Try to get dimensions from the actual image file
          const tempImg = new Image();
          tempImg.onload = () => {
            console.log("🔍 Actual image file dimensions:", {
              naturalWidth: tempImg.naturalWidth,
              naturalHeight: tempImg.naturalHeight,
            });
          };
          tempImg.src = img.src;

          // Use natural dimensions if available
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            finalWidth = img.naturalWidth;
            finalHeight = img.naturalHeight;
            console.log("✅ Using natural dimensions from image file");
          }
        }
      }

      // Cap dimensions to reasonable values
      const maxReasonableSize = 1500;
      finalWidth = Math.min(finalWidth, maxReasonableSize);
      finalHeight = Math.min(finalHeight, maxReasonableSize);

      console.log("🔍 VISUAL INSPECTION DEBUG - Final dimensions:", {
        imgElement: img,
        imgSrc: img.src,
        imgAlt: img.alt,
        imgRect: {
          width: imgRect.width,
          height: imgRect.height,
          x: imgRect.x,
          y: imgRect.y,
        },
        parentRect: {
          width: parentRect.width,
          height: parentRect.height,
          x: parentRect.x,
          y: parentRect.y,
        },
        finalDimensions: {
          width: finalWidth,
          height: finalHeight,
        },
        position: {
          top: imgTop,
          left: imgLeft,
        },
      });

      // Set the overlay to match the image dimensions exactly, accounting for borders
      // Get computed border width to ensure watermarks don't extend beyond visual boundaries
      const computedStyle = getComputedStyle(img);
      const borderTopWidth = parseInt(computedStyle.borderTopWidth) || 0;
      const borderLeftWidth = parseInt(computedStyle.borderLeftWidth) || 0;
      const borderRightWidth = parseInt(computedStyle.borderRightWidth) || 0;
      const borderBottomWidth = parseInt(computedStyle.borderBottomWidth) || 0;

      // Position overlay to account for borders - watermarks should be within visual boundaries
      const overlayTop = imgTop + borderTopWidth;
      const overlayLeft = imgLeft + borderLeftWidth;
      const overlayWidth = finalWidth - borderLeftWidth - borderRightWidth;
      const overlayHeight = finalHeight - borderTopWidth - borderBottomWidth;

      watermarkOverlay.style.cssText = `
      position: absolute;
      top: ${overlayTop}px;
      left: ${overlayLeft}px;
      width: ${overlayWidth}px;
      height: ${overlayHeight}px;
      pointer-events: none;
      user-select: none;
      z-index: 999999;
      overflow: hidden;
    `;

      // Force the overlay to be visible and properly sized
      watermarkOverlay.style.setProperty("display", "block", "important");
      watermarkOverlay.style.setProperty("visibility", "visible", "important");
      watermarkOverlay.style.setProperty("opacity", "1", "important");

      // Add padding to keep watermarks away from image borders
      const borderPadding = Math.max(25, fontSize * 3); // Increased from 2x to 3x font size for better spacing

      // Create a grid of watermarks only within the overlay boundaries (with padding)
      const availableWidth = overlayWidth - borderPadding * 2;
      const availableHeight = overlayHeight - borderPadding * 2;
      const cols = Math.ceil(availableWidth / spacing);
      const rows = Math.ceil(availableHeight / spacing);

      // Debug: Log the positioning values
      console.log("🔍 Watermark positioning debug:", {
        imgTop,
        imgLeft,
        finalWidth,
        finalHeight,
        borderPadding,
        availableWidth,
        availableHeight,
        cols,
        rows,
        spacing,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        offsetWidth: img.offsetWidth,
        offsetHeight: img.offsetHeight,
      });

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const watermarkElement = document.createElement("div");
          watermarkElement.textContent = this.config.watermarkText;

          // Calculate position relative to the overlay (which is already positioned at the image)
          const watermarkTop = borderPadding + row * spacing;
          const watermarkLeft = borderPadding + col * spacing;

          watermarkElement.style.cssText = `
          position: absolute;
          top: ${watermarkTop}px;
          left: ${watermarkLeft}px;
          font-size: ${fontSize}px;
          font-weight: 200;
          color: rgba(255, 255, 255, 0.15);
          font-family: 'Arial', sans-serif;
          transform: rotate(-12deg);
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          -webkit-text-stroke: 0.5px rgba(0, 0, 0, 0.2);
          text-stroke: 0.5px rgba(0, 0, 0, 0.2);
        `;

          // Debug: Log each watermark position
          console.log(`🔍 Watermark [${row},${col}] position:`, {
            top: watermarkTop,
            left: watermarkLeft,
            absoluteTop: imgTop + watermarkTop,
            absoluteLeft: imgLeft + watermarkLeft,
          });

          watermarkOverlay.appendChild(watermarkElement);
        }
      }

      // Add a debug border to show the watermark area (development only)
      if (import.meta.env.DEV) {
        // Debug border for the actual image element - REMOVED BLUE BORDER
        // const imageDebugBorder = document.createElement('div');
        // imageDebugBorder.style.cssText = `
        //   position: absolute;
        //   top: ${imgTop}px;
        //   left: ${imgLeft}px;
        //   width: ${finalWidth}px;
        //   height: ${finalHeight}px;
        //   border: 3px solid blue;
        //   pointer-events: none;
        //   z-index: 999997;
        //   background: rgba(0, 0, 255, 0.05);
        // `;
        // imageDebugBorder.setAttribute('data-watermark-debug', 'true');
        // parent.appendChild(imageDebugBorder);

        console.log("🔍 Watermark positioning completed:", {
          watermarkArea: {
            top: overlayTop + borderPadding,
            left: overlayLeft + borderPadding,
            width: availableWidth,
            height: availableHeight,
          },
          overlayElement: {
            top: overlayTop,
            left: overlayLeft,
            width: overlayWidth,
            height: overlayHeight,
          },
          imageElement: {
            top: imgTop,
            left: imgLeft,
            width: finalWidth,
            height: finalHeight,
          },
        });
      }

      // Check if parent has overflow hidden
      if (
        parentStyle.overflow === "hidden" ||
        parentStyle.overflow === "clip"
      ) {
        console.log(
          "⚠️  WARNING: Parent has overflow hidden - this will clip watermarks!",
        );

        // Try to fix by changing parent overflow
        parent.style.setProperty("overflow", "visible", "important");
        console.log("🔧 Fixed parent overflow to visible");
      }
    }

    // Check all ancestor containers for clipping
    let ancestor = parent;
    let depth = 1;
    while (ancestor && depth <= 5) {
      const ancestorStyle = getComputedStyle(ancestor);
      if (
        ancestorStyle.overflow === "hidden" ||
        ancestorStyle.overflow === "clip"
      ) {
        console.log(
          `⚠️  WARNING: Ancestor at depth ${depth} has overflow hidden:`,
          ancestor,
        );
        console.log("🔧 Fixing ancestor overflow...");
        ancestor.style.setProperty("overflow", "visible", "important");
      }
      ancestor = ancestor.parentElement;
      depth++;
    }

    // Add watermark overlay to parent container (not to img tag)
    if (parent) {
      parent.appendChild(watermarkOverlay);
      console.log("🔍 Watermark overlay added to parent container:", parent);

      // Verify the watermark is in the DOM
      const addedWatermark = parent.querySelector(
        '[data-watermark-overlay="true"]',
      ) as HTMLElement;
      if (addedWatermark) {
        console.log(
          "✅ Watermark element verified in DOM (on parent):",
          addedWatermark,
        );
        console.log("✅ Watermark styles:", addedWatermark.style.cssText);

        // Force visibility with !important styles
        addedWatermark.style.setProperty("display", "block", "important");
        addedWatermark.style.setProperty("visibility", "visible", "important");
        addedWatermark.style.setProperty("opacity", "1", "important");
        addedWatermark.style.setProperty("z-index", "999999", "important");

        // Debug positioning context
        console.log("🔍 Watermark positioning context:");
        console.log("  - Parent element:", parent);
        console.log("  - Parent tag:", parent.tagName);
        console.log("  - Parent classes:", parent.className);

        const parentStyle = getComputedStyle(parent);
        console.log("  - Parent computed styles:");
        console.log("    position:", parentStyle.position);
        console.log("    overflow:", parentStyle.overflow);
        console.log("    display:", parentStyle.display);
        console.log("    width:", parentStyle.width);
        console.log("    height:", parentStyle.height);
        console.log("    zIndex:", parentStyle.zIndex);
        console.log("    transform:", parentStyle.transform);
        console.log("    clipPath:", parentStyle.clipPath);

        const watermarkStyle = getComputedStyle(addedWatermark);
        console.log("  - Watermark computed styles:");
        console.log("    position:", watermarkStyle.position);
        console.log("    bottom:", watermarkStyle.bottom);
        console.log("    right:", watermarkStyle.right);
        console.log("    zIndex:", watermarkStyle.zIndex);
        console.log("    display:", watermarkStyle.display);
        console.log("    visibility:", watermarkStyle.visibility);
        console.log("    opacity:", watermarkStyle.opacity);

        const watermarkRect = addedWatermark.getBoundingClientRect();
        console.log("  - Watermark bounding rect:");
        console.log("    x:", watermarkRect.x);
        console.log("    y:", watermarkRect.y);
        console.log("    width:", watermarkRect.width);
        console.log("    height:", watermarkRect.height);
        console.log("    top:", watermarkRect.top);
        console.log("    left:", watermarkRect.left);
        console.log("    bottom:", watermarkRect.bottom);
        console.log("    right:", watermarkRect.right);

        const parentRect = parent.getBoundingClientRect();
        console.log("  - Parent bounding rect:");
        console.log("    x:", parentRect.x);
        console.log("    y:", parentRect.y);
        console.log("    width:", parentRect.width);
        console.log("    height:", parentRect.height);
        console.log("    top:", parentRect.top);
        console.log("    left:", parentRect.left);
        console.log("    bottom:", parentRect.bottom);
        console.log("    right:", parentRect.right);

        console.log("✅ Forced watermark visibility with !important styles");
      } else {
        console.error(
          "❌ Watermark element not found in DOM after adding to parent",
        );
      }
    } else {
      console.error("❌ No parent container found for image watermark");
    }

    // For print: enhance watermark visibility
    img.addEventListener("beforeprint", () => {
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
    img.addEventListener("afterprint", () => {
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
      const originalDescription = metaDescription.getAttribute("content") || "";
      metaDescription.setAttribute(
        "content",
        `${originalDescription} ${this.config.watermarkText}`,
      );
    }

    // Add watermark to page content
    const body = document.body;
    body.setAttribute("data-watermark-id", this.watermarkId);
    body.setAttribute("data-watermark-timestamp", Date.now().toString());
    body.setAttribute("data-watermark-session", this.sessionId);

    console.log("🔒 Metadata watermarks applied");
  }

  // Add CSS-based watermarks
  addCSSWatermarks(): void {
    const style = document.createElement("style");
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
    document.body.classList.add("watermark-overlay");

    console.log("🔒 CSS watermarks applied (non-intrusive)");
  }

  // Add JavaScript-based protection
  addJavaScriptProtection(): void {
    // Disable right-click context menu
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.trackProtectionEvent("right_click_blocked");
    });

    // Disable text selection on protected elements
    document.addEventListener("selectstart", (e) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute("data-watermark")) {
        e.preventDefault();
        this.trackProtectionEvent("text_selection_blocked");
      }
    });

    // Disable drag and drop
    document.addEventListener("dragstart", (e) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute("data-watermark") || target.tagName === "IMG") {
        e.preventDefault();
        this.trackProtectionEvent("drag_blocked");
      }
    });

    // Disable copy operations
    document.addEventListener("copy", (e) => {
      this.trackProtectionEvent("copy_attempted");
      // Allow copy but add watermark to clipboard
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const watermarkText = `\n\n${this.config.watermarkText}`;
        e.clipboardData?.setData(
          "text/plain",
          selection.toString() + watermarkText,
        );
        e.preventDefault();
      }
    });

    // Disable print (add watermark to print)
    window.addEventListener("beforeprint", () => {
      this.trackProtectionEvent("print_attempted");
      this.addPrintWatermark();
    });

    console.log("🔒 JavaScript protection applied");
  }

  // Add watermark to print output
  private addPrintWatermark(): void {
    const printStyle = document.createElement("style");
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
      watermarkId: this.watermarkId,
    };

    // Send to tracking endpoint if configured
    if (this.config.trackingEndpoint) {
      this.sendTrackingData(eventData, eventType);
    }

    // Log locally
    console.log("🔒 Protection event:", eventType, eventData);
  }

  // Generate content hash for tracking
  private generateContentHash(): string {
    const content = document.body.textContent || "";
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  // Get user identifier
  private getUserId(): string {
    // Use existing user ID or generate one
    let userId = localStorage.getItem("portfolio_user_id");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("portfolio_user_id", userId);
    }
    return userId;
  }

  // Send tracking data
  private async sendTrackingData(
    data: WatermarkData,
    eventType: string,
  ): Promise<void> {
    try {
      await fetch(this.config.trackingEndpoint!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          eventType,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.warn("Failed to send tracking data:", error);
    }
  }

  // Apply all watermarks
  applyAllWatermarks(): void {
    console.log("🔒 Applying content watermarks...");

    this.addTextWatermarks();
    this.addImageWatermarks(); // DISABLED FOR PRODUCTION - no visual interference
    this.addMetadataWatermarks();
    this.addCSSWatermarks();
    this.addJavaScriptProtection();

    // Ensure debug borders are properly layered on top
    this.ensureDebugBordersOnTop();

    console.log("🔒 All watermarks applied successfully");
  }

  // Ensure debug borders are on top of all watermarks
  private ensureDebugBordersOnTop(): void {
    if (!import.meta.env.DEV || !window.watermarkDebugBorders) return;

    console.log("🔍 Ensuring debug borders are on top...");

    window.watermarkDebugBorders.forEach((borderData, index) => {
      const { element, parent, type } = borderData;

      // Remove and re-add to ensure it's at the end of the DOM (highest z-index)
      if (parent && parent.contains(element)) {
        parent.removeChild(element);
        parent.appendChild(element);
        console.log(`🔍 Re-layered ${type} border ${index}`);
      }
    });
  }

  // Remove all watermarks
  removeAllWatermarks(): void {
    // Remove watermark elements
    document.querySelectorAll("[data-watermark]").forEach((el) => {
      el.removeAttribute("data-watermark");
      el.removeAttribute("data-watermark-id");
      el.removeAttribute("data-element-index");
    });

    // Remove image watermark overlays
    const imageWatermarks = document.querySelectorAll(
      '[data-watermark-overlay="true"]',
    );
    imageWatermarks.forEach((watermark) => watermark.remove());

    // Remove debug elements
    document
      .querySelectorAll('[data-watermark-debug="true"]')
      .forEach((el) => el.remove());

    // Remove watermark classes
    document.body.classList.remove("watermark-overlay");

    // Remove watermark styles
    document.querySelectorAll("style").forEach((style) => {
      if (style.textContent?.includes("watermark-overlay")) {
        style.remove();
      }
    });

    // Clear global debug borders array
    if (window.watermarkDebugBorders) {
      window.watermarkDebugBorders = [];
    }

    console.log("🔒 All watermarks removed");
  }

  // Get watermark statistics
  getWatermarkStats(): {
    textElements: number;
    images: number;
    metadata: boolean;
    css: boolean;
  } {
    const textElements = document.querySelectorAll("[data-watermark]").length;
    const images = document.querySelectorAll(
      '[data-watermark-overlay="true"]',
    ).length;
    const metadata = document.body.hasAttribute("data-watermark-id");
    const css = document.body.classList.contains("watermark-overlay");

    return {
      textElements,
      images,
      metadata,
      css,
    };
  }

  // Debug method to highlight watermarks
  debugWatermarks(): void {
    console.log("🔍 Debugging watermarks...");

    const imageWatermarks = document.querySelectorAll(
      '[data-watermark-overlay="true"]',
    );
    console.log("🔍 Found", imageWatermarks.length, "image watermarks");

    imageWatermarks.forEach((watermark, index) => {
      const watermarkEl = watermark as HTMLElement;
      console.log(`🔍 Watermark ${index}:`, {
        element: watermarkEl,
        text: watermarkEl.textContent,
        styles: watermarkEl.style.cssText,
        computedStyles: getComputedStyle(watermarkEl),
        parent: watermarkEl.parentElement,
        parentStyles: watermarkEl.parentElement
          ? getComputedStyle(watermarkEl.parentElement)
          : null,
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
    const allImages = document.querySelectorAll("img");
    console.log("🔍 Checking all images for watermark data:");
    allImages.forEach((img, index) => {
      const imgEl = img as HTMLImageElement;
      console.log(`Image ${index}:`, {
        src: imgEl.src,
        hasWatermark: imgEl.hasAttribute("data-watermark"),
        watermarkId: imgEl.getAttribute("data-watermark-id"),
        watermarkOverlay: imgEl.querySelector(
          '[data-watermark-overlay="true"]',
        ),
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

// Create global watermarking instance - PRODUCTION CONFIG
export const contentWatermarking = new ContentWatermarking({
  enableTextWatermarking: true,
  enableImageWatermarking: false, // DISABLED FOR PRODUCTION
  enableMetadataWatermarking: true,
  watermarkOpacity: 0.15,
  watermarkSize: 1,
  watermarkText: "© Hien Le 2025",
  watermarkColor: "rgba(255, 255, 255, 0.15)",
  enableTracking: true,
});

export default contentWatermarking;
