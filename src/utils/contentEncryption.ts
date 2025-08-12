/**
 * @fileoverview Client-side content encryption with dynamic keys and watermark verification
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license GPL v3
 */

interface EncryptionKey {
  id: string;
  key: string;
  timestamp: number;
  expiresAt: number;
  version: string;
}

interface EncryptedContent {
  data: string;
  iv: string;
  keyId: string;
  watermark: string;
  signature: string;
}

interface WatermarkData {
  userId: string;
  timestamp: number;
  sessionId: string;
  contentHash: string;
}

interface SecurityAlertData {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
}

class ContentEncryption {
  private currentKey!: EncryptionKey;
  private keyRotationInterval!: NodeJS.Timeout;
  private watermarkData: WatermarkData;
  private encryptionEnabled: boolean;

  constructor() {
    this.encryptionEnabled = true;
    this.watermarkData = {
      userId: this.generateUserId(),
      timestamp: Date.now(),
      sessionId: this.generateSessionId(),
      contentHash: "",
    };

    this.initializeEncryption();
  }

  private async initializeEncryption(): Promise<void> {
    await this.generateNewKey();
    this.startKeyRotation();
    this.setupWatermarkVerification();
  }

  private async generateNewKey(): Promise<void> {
    const key = await this.generateRandomKey();
    const now = Date.now();

    this.currentKey = {
      id: this.generateKeyId(),
      key: key,
      timestamp: now,
      expiresAt: now + 30 * 60 * 1000, // 30 minutes
      version: "1.0.0",
    };

    console.log("🔑 New encryption key generated:", this.currentKey.id);
  }

  private async generateRandomKey(): Promise<string> {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  }

  private generateKeyId(): string {
    return `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateUserId(): string {
    return `user_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startKeyRotation(): void {
    this.keyRotationInterval = setInterval(
      () => {
        this.rotateKey();
      },
      25 * 60 * 1000,
    ); // Rotate every 25 minutes (before 30 min expiry)
  }

  private async rotateKey(): Promise<void> {
    console.log("🔄 Rotating encryption key...");
    await this.generateNewKey();

    // Re-encrypt any cached content with new key
    this.reEncryptCachedContent();
  }

  private reEncryptCachedContent(): void {
    // Find all encrypted content and re-encrypt with new key
    const encryptedElements = document.querySelectorAll("[data-encrypted]");
    encryptedElements.forEach(async (element) => {
      const encryptedData = element.getAttribute("data-encrypted");
      if (encryptedData) {
        try {
          const decrypted = await this.decryptContent(encryptedData);
          const reEncrypted = await this.encryptContent(decrypted);
          element.setAttribute("data-encrypted", reEncrypted);
        } catch (error) {
          console.warn("Failed to re-encrypt content:", error);
        }
      }
    });
  }

  public async encryptContent(content: string): Promise<string> {
    if (!this.encryptionEnabled) return content;

    try {
      // Generate initialization vector
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Convert key to ArrayBuffer
      const keyBuffer = new Uint8Array(
        this.currentKey.key.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
      );

      // Import key
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM" },
        false,
        ["encrypt"],
      );

      // Encrypt content
      const contentBuffer = new TextEncoder().encode(content);
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        contentBuffer,
      );

      // Create watermark
      const watermark = this.generateWatermark(content);

      // Create signature
      const signature = await this.createSignature(content, watermark);

      // Prepare encrypted content object
      const encryptedContent: EncryptedContent = {
        data: Array.from(new Uint8Array(encryptedBuffer), (byte) =>
          byte.toString(16).padStart(2, "0"),
        ).join(""),
        iv: Array.from(iv, (byte) => byte.toString(16).padStart(2, "0")).join(
          "",
        ),
        keyId: this.currentKey.id,
        watermark: watermark,
        signature: signature,
      };

      return JSON.stringify(encryptedContent);
    } catch (error) {
      console.error("Encryption failed:", error);
      return content; // Fallback to unencrypted
    }
  }

  public async decryptContent(encryptedData: string): Promise<string> {
    if (!this.encryptionEnabled) return encryptedData;

    try {
      const encryptedContent: EncryptedContent = JSON.parse(encryptedData);

      // Verify watermark integrity
      if (!(await this.verifyWatermark(encryptedContent))) {
        throw new Error("Watermark verification failed");
      }

      // Convert key to ArrayBuffer
      const keyBuffer = new Uint8Array(
        this.currentKey.key.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
      );

      // Import key
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM" },
        false,
        ["decrypt"],
      );

      // Convert encrypted data and IV back to ArrayBuffer
      const encryptedBuffer = new Uint8Array(
        encryptedContent.data
          .match(/.{1,2}/g)!
          .map((byte) => parseInt(byte, 16)),
      );
      const iv = new Uint8Array(
        encryptedContent.iv.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
      );

      // Decrypt content
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        encryptedBuffer,
      );

      const decryptedContent = new TextDecoder().decode(decryptedBuffer);

      // Update watermark data
      this.watermarkData.contentHash = await this.hashContent(decryptedContent);

      return decryptedContent;
    } catch (error) {
      console.error("Decryption failed:", error);
      return encryptedData; // Fallback to encrypted data
    }
  }

  private generateWatermark(content: string): string {
    const watermarkData = {
      ...this.watermarkData,
      contentHash: this.hashContent(content),
      timestamp: Date.now(),
    };

    return btoa(JSON.stringify(watermarkData));
  }

  private async verifyWatermark(
    encryptedContent: EncryptedContent,
  ): Promise<boolean> {
    try {
      const watermarkData: WatermarkData = JSON.parse(
        atob(encryptedContent.watermark),
      );

      // Check if watermark is not too old (within 1 hour)
      if (Date.now() - watermarkData.timestamp > 60 * 60 * 1000) {
        console.warn("Watermark too old");
        return false;
      }

      // Verify session ID
      if (watermarkData.sessionId !== this.watermarkData.sessionId) {
        console.warn("Session ID mismatch");
        return false;
      }

      // Verify signature
      const expectedSignature = await this.createSignature(
        encryptedContent.data,
        encryptedContent.watermark,
      );

      if (encryptedContent.signature !== expectedSignature) {
        console.warn("Signature verification failed");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Watermark verification error:", error);
      return false;
    }
  }

  private async createSignature(
    data: string,
    watermark: string,
  ): Promise<string> {
    const message = data + watermark + this.currentKey.key;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(message);

    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  private async hashContent(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(content);

    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  private setupWatermarkVerification(): void {
    // Periodically verify watermarks on the page
    setInterval(() => {
      this.verifyPageWatermarks();
    }, 10 * 1000); // Every 10 seconds
  }

  private async verifyPageWatermarks(): Promise<void> {
    const encryptedElements = document.querySelectorAll("[data-encrypted]");
    let verificationFailures = 0;

    for (const element of Array.from(encryptedElements)) {
      const encryptedData = element.getAttribute("data-encrypted");
      if (encryptedData) {
        try {
          const encryptedContent: EncryptedContent = JSON.parse(encryptedData);
          if (!(await this.verifyWatermark(encryptedContent))) {
            verificationFailures++;
            this.handleWatermarkViolation(element);
          }
        } catch (error) {
          verificationFailures++;
          console.warn("Watermark verification failed for element:", element);
        }
      }
    }

    if (verificationFailures > 0) {
      console.warn(
        `🚨 ${verificationFailures} watermark verification failures detected`,
      );
      this.emitSecurityAlert("watermark_violation", {
        failures: verificationFailures,
      });
    }
  }

  private handleWatermarkViolation(element: Element): void {
    // Mark element as compromised
    element.setAttribute("data-compromised", "true");
    
    if (element instanceof HTMLElement) {
      element.style.opacity = "0.5";
    }

    // Add warning indicator
    const warning = document.createElement("div");
    warning.innerHTML = "⚠️ Content integrity compromised";
    warning.style.cssText = "color: red; font-size: 12px; margin-top: 5px;";
    element.appendChild(warning);
  }

  private emitSecurityAlert(type: string, data: Record<string, unknown>): void {
    const event = new CustomEvent("securityAlert", {
      detail: { type, data, timestamp: Date.now() },
    });
    window.dispatchEvent(event);
  }

  public getCurrentKey(): EncryptionKey {
    return { ...this.currentKey };
  }

  public getWatermarkData(): WatermarkData {
    return { ...this.watermarkData };
  }

  public isEncryptionEnabled(): boolean {
    return this.encryptionEnabled;
  }

  public toggleEncryption(enabled: boolean): void {
    this.encryptionEnabled = enabled;
    console.log(`🔐 Content encryption ${enabled ? "enabled" : "disabled"}`);
  }

  public destroy(): void {
    if (this.keyRotationInterval) {
      clearInterval(this.keyRotationInterval);
    }
  }
}

export default ContentEncryption;
