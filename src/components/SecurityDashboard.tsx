/**
 * @fileoverview Security Dashboard Component for Portfolio Protection
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import React, { useState, useEffect } from "react";

import { rateLimiter } from "../utils/rateLimiter";
import { securityHeaders } from "../utils/securityHeaders";
import { antiScraping } from "../utils/antiScraping";
import { contentWatermarking } from "../utils/contentWatermarking";

interface SecurityStats {
  rateLimiting: {
    totalClients: number;
    blockedClients: number;
    storeSize: number;
  };
  antiScraping: {
    totalIPs: number;
    suspiciousIPs: number;
    requestHistorySize: number;
  };
  securityHeaders: {
    enabled: boolean;
    totalHeaders: number;
    validationErrors: string[];
  };
  watermarking: {
    textElements: number;
    images: number;
    metadata: boolean;
    css: boolean;
  };
}

const SecurityDashboard: React.FC = () => {
  const [stats, setStats] = useState<SecurityStats>({
    rateLimiting: { totalClients: 0, blockedClients: 0, storeSize: 0 },
    antiScraping: { totalIPs: 0, suspiciousIPs: 0, requestHistorySize: 0 },
    securityHeaders: { enabled: true, totalHeaders: 0, validationErrors: [] },
    watermarking: { textElements: 0, images: 0, metadata: false, css: false },
  });
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "rate-limiting" | "anti-scraping" | "headers"
  >("overview");

  // Auto-hide in production - only show in development
  const isDevelopment = import.meta.env.DEV;

  // Don't render anything in production
  if (!isDevelopment) {
    return null;
  }

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const updateStats = () => {
    const rateLimitStats = rateLimiter.getStats();
    const antiScrapingStats = antiScraping.getStats();
    const headerValidation = securityHeaders.validateConfig();
    const watermarkingStats = contentWatermarking.getWatermarkStats();

    setStats({
      rateLimiting: rateLimitStats,
      antiScraping: antiScrapingStats,
      securityHeaders: {
        enabled: headerValidation.valid,
        totalHeaders: Object.keys(securityHeaders.getHeaders()).length,
        validationErrors: headerValidation.errors,
      },
      watermarking: watermarkingStats,
    });
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleBlockIP = (ip: string) => {
    rateLimiter.blacklistIP(ip);
    updateStats();
  };

  const handleUnblockIP = (ip: string) => {
    rateLimiter.whitelistIP(ip);
    updateStats();
  };

  const handleRemoveSuspiciousIP = (ip: string) => {
    antiScraping.removeSuspiciousIP(ip);
    updateStats();
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-200"
        title="Security Dashboard (Development Only)"
      >
        🔒 Security
        <div className="text-xs opacity-75">DEV</div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-red-600 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">🔒 Security Dashboard</h3>
          <span className="text-xs bg-red-700 px-2 py-1 rounded-full">
            DEV ONLY
          </span>
        </div>
        <button
          onClick={toggleVisibility}
          className="text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {["overview", "rate-limiting", "anti-scraping", "headers"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(
                  tab as
                    | "overview"
                    | "rate-limiting"
                    | "anti-scraping"
                    | "headers",
                )
              }
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {tab
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </button>
          ),
        )}
      </div>

      {/* Content */}
      <div className="p-4 h-80 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-400">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Development Mode:</strong> This security dashboard is
                only visible during development. In production, all security
                features remain active but hidden from visitors.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.rateLimiting.totalClients}
                </div>
                <div className="text-sm text-green-600">Active Clients</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {stats.rateLimiting.blockedClients}
                </div>
                <div className="text-sm text-red-600">Blocked Clients</div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.antiScraping.suspiciousIPs}
              </div>
              <div className="text-sm text-blue-600">Suspicious IPs</div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats.watermarking.textElements + stats.watermarking.images}
              </div>
              <div className="text-sm text-purple-600">
                Watermarked Elements
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${
                stats.securityHeaders.enabled
                  ? "bg-green-50 dark:bg-green-900/20"
                  : "bg-yellow-50 dark:bg-yellow-900/20"
              }`}
            >
              <div
                className={`text-lg font-semibold ${
                  stats.securityHeaders.enabled
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {stats.securityHeaders.enabled
                  ? "✅ Security Headers Active"
                  : "⚠️ Security Headers Issues"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stats.securityHeaders.totalHeaders} headers configured
              </div>
            </div>
          </div>
        )}

        {activeTab === "rate-limiting" && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <h4 className="font-semibold mb-2">Rate Limiting Stats</h4>
              <div className="space-y-2 text-sm">
                <div>Total Clients: {stats.rateLimiting.totalClients}</div>
                <div>Blocked Clients: {stats.rateLimiting.blockedClients}</div>
                <div>Store Size: {stats.rateLimiting.storeSize}</div>
              </div>
            </div>

            <button
              onClick={updateStats}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh Stats
            </button>
          </div>
        )}

        {activeTab === "anti-scraping" && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <h4 className="font-semibold mb-2">Anti-Scraping Stats</h4>
              <div className="space-y-2 text-sm">
                <div>Total IPs: {stats.antiScraping.totalIPs}</div>
                <div>Suspicious IPs: {stats.antiScraping.suspiciousIPs}</div>
                <div>
                  Request History: {stats.antiScraping.requestHistorySize}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <h4 className="font-semibold mb-2 text-yellow-800">
                Suspicious IPs
              </h4>
              <div className="space-y-2">
                {antiScraping.getSuspiciousIPs().map((ip) => (
                  <div key={ip} className="flex justify-between items-center">
                    <span className="text-sm font-mono">{ip}</span>
                    <button
                      onClick={() => handleRemoveSuspiciousIP(ip)}
                      className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {antiScraping.getSuspiciousIPs().length === 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    No suspicious IPs detected
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "headers" && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <h4 className="font-semibold mb-2">Security Headers</h4>
              <div className="space-y-2 text-sm">
                <div>Total Headers: {stats.securityHeaders.totalHeaders}</div>
                <div>
                  Status:{" "}
                  {stats.securityHeaders.enabled ? "✅ Valid" : "❌ Issues"}
                </div>
              </div>
            </div>

            {stats.securityHeaders.validationErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <h4 className="font-semibold mb-2 text-red-800">
                  Validation Errors
                </h4>
                <div className="space-y-1">
                  {stats.securityHeaders.validationErrors.map(
                    (error, index) => (
                      <div
                        key={index}
                        className="text-sm text-red-700 dark:text-red-300"
                      >
                        • {error}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800">
                Active Headers
              </h4>
              <div className="space-y-1 text-sm">
                {Object.entries(securityHeaders.getHeaders()).map(
                  ([key, value]) => (
                    <div key={key} className="font-mono text-xs">
                      <span className="text-blue-600">{key}:</span> {value}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
