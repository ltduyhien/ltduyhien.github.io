/**
 * @fileoverview Watermarking Dashboard Component for Portfolio Protection
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import React, { useState, useEffect } from "react";

import { contentWatermarking } from "../utils/contentWatermarking";

console.log(
  "🔍 WatermarkingDashboard: contentWatermarking imported:",
  contentWatermarking,
);
console.log("🔍 WatermarkingDashboard: contentWatermarking methods:", {
  applyAllWatermarks: contentWatermarking?.applyAllWatermarks,
  removeAllWatermarks: contentWatermarking?.removeAllWatermarks,
  getWatermarkStats: contentWatermarking?.getWatermarkStats,
});

interface WatermarkStats {
  textElements: number;
  images: number;
  metadata: boolean;
  css: boolean;
}

const WatermarkingDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "configuration" | "statistics" | "protection"
  >("overview");
  const [watermarksApplied, setWatermarksApplied] = useState(false);
  const [stats, setStats] = useState<WatermarkStats>({
    textElements: 0,
    images: 0,
    metadata: false,
    css: false,
  });
  const [config, setConfig] = useState(contentWatermarking.getConfig());

  useEffect(() => {
    updateStats();
  }, [watermarksApplied]);

  const updateStats = () => {
    setStats(contentWatermarking.getWatermarkStats());
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const applyWatermarks = () => {
    console.log("🔍 WatermarkingDashboard: applyWatermarks called");
    console.log("🔍 contentWatermarking object:", contentWatermarking);
    console.log(
      "🔍 contentWatermarking.applyAllWatermarks:",
      contentWatermarking.applyAllWatermarks,
    );

    try {
      contentWatermarking.applyAllWatermarks();
      console.log("✅ Watermarks applied successfully");
    } catch (error) {
      console.error("❌ Error applying watermarks:", error);
    }

    setWatermarksApplied(true);
    updateStats();
  };

  const removeWatermarks = () => {
    contentWatermarking.removeAllWatermarks();
    setWatermarksApplied(false);
    updateStats();
  };

  const updateConfiguration = (newConfig: Partial<typeof config>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    contentWatermarking.updateConfig(updatedConfig);
  };

  // Auto-hide in production - only show in development
  const isDevelopment = import.meta.env.DEV;

  // Don't render anything in production
  if (!isDevelopment) {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-32 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-200"
        title="Watermarking Dashboard (Development Only)"
      >
        💧 Watermark
        <div className="text-xs opacity-75">DEV</div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">💧 Watermarking Dashboard</h3>
          <span className="text-xs bg-blue-700 px-2 py-1 rounded-full">
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
        {["overview", "configuration", "statistics", "protection"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(
                  tab as
                    | "overview"
                    | "configuration"
                    | "statistics"
                    | "protection",
                )
              }
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
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
                <strong>Content Watermarking:</strong> Protect your portfolio
                content with invisible ownership markers, copy protection, and
                usage tracking.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.textElements}
                </div>
                <div className="text-sm text-green-600">Text Elements</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.images}
                </div>
                <div className="text-sm text-blue-600">Images</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Watermarks Applied:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    watermarksApplied
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                  }`}
                >
                  {watermarksApplied ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={applyWatermarks}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Apply Watermarks
                </button>
                <button
                  onClick={removeWatermarks}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Remove Watermarks
                </button>
              </div>

              <div className="mt-2 space-y-2">
                <button
                  onClick={() => contentWatermarking.debugWatermarks()}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  🔍 Debug Watermarks
                </button>

                <button
                  onClick={() => {
                    console.log("🧪 Testing watermarking system...");
                    console.log("🧪 contentWatermarking:", contentWatermarking);
                    console.log("🧪 Testing direct method call...");

                    // Test direct method call
                    if (
                      contentWatermarking &&
                      typeof contentWatermarking.addImageWatermarks ===
                        "function"
                    ) {
                      console.log("🧪 Calling addImageWatermarks directly...");
                      contentWatermarking.addImageWatermarks();
                    } else {
                      console.error("🧪 addImageWatermarks method not found!");
                    }
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  🧪 Test Direct Method
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "configuration" && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <h4 className="font-semibold mb-3">Watermark Configuration</h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={config.watermarkText}
                    onChange={(e) =>
                      updateConfiguration({ watermarkText: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Opacity
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.watermarkOpacity}
                      onChange={(e) =>
                        updateConfiguration({
                          watermarkOpacity: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">
                      {config.watermarkOpacity}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Size
                    </label>
                    <input
                      type="number"
                      min="8"
                      max="32"
                      value={config.watermarkSize}
                      onChange={(e) =>
                        updateConfiguration({
                          watermarkSize: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={config.watermarkColor}
                    onChange={(e) =>
                      updateConfiguration({ watermarkColor: e.target.value })
                    }
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enableTextWatermarking}
                      onChange={(e) =>
                        updateConfiguration({
                          enableTextWatermarking: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Enable Text Watermarking</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enableImageWatermarking}
                      onChange={(e) =>
                        updateConfiguration({
                          enableImageWatermarking: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Enable Image Watermarking</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enableMetadataWatermarking}
                      onChange={(e) =>
                        updateConfiguration({
                          enableMetadataWatermarking: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">
                      Enable Metadata Watermarking
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enableTracking}
                      onChange={(e) =>
                        updateConfiguration({
                          enableTracking: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Enable Usage Tracking</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "statistics" && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <h4 className="font-semibold mb-3">Watermark Statistics</h4>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Text Elements Watermarked:</span>
                  <span className="font-semibold text-blue-600">
                    {stats.textElements}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm">Images Watermarked:</span>
                  <span className="font-semibold text-blue-600">
                    {stats.images}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm">Metadata Watermarks:</span>
                  <span
                    className={`font-semibold ${stats.metadata ? "text-green-600" : "text-red-600"}`}
                  >
                    {stats.metadata ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm">CSS Watermarks:</span>
                  <span
                    className={`font-semibold ${stats.css ? "text-green-600" : "text-red-600"}`}
                  >
                    {stats.css ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800">
                Current Configuration
              </h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <div>Text: {config.watermarkText}</div>
                <div>Opacity: {config.watermarkOpacity}</div>
                <div>Size: {config.watermarkSize}px</div>
                <div>Color: {config.watermarkColor}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "protection" && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <h4 className="font-semibold mb-3">Protection Features</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-sm">Right-click Protection</span>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-sm">Text Selection Protection</span>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-sm">Drag & Drop Protection</span>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-sm">Copy Protection</span>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-sm">Print Protection</span>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <h4 className="font-semibold mb-2 text-yellow-800">
                Protection Notes
              </h4>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                <p>• Right-click context menu is disabled</p>
                <p>• Text selection adds watermark to clipboard</p>
                <p>• Images are protected from dragging</p>
                <p>• Print output includes watermarks</p>
                <p>• All protection events are tracked</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatermarkingDashboard;
