/**
 * @fileoverview Security monitoring dashboard with real-time metrics and alerts
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license GPL v3
 */

import React, { useState, useEffect, useRef } from 'react';
import AdvancedBotProtection from '../utils/advancedBotProtection';
import ContentEncryption from '../utils/contentEncryption';

interface SecurityEvent {
  id: string;
  type: 'bot_detection' | 'encryption_failure' | 'watermark_violation' | 'geographic_block' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  details: any;
  resolved: boolean;
}

interface SecurityMetrics {
  botAttempts: number;
  blockedIPs: number;
  geographicBlocks: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  encryptionFailures: number;
  watermarkViolations: number;
  activeThreats: number;
  lastUpdate: number;
}

interface ThreatAnalysis {
  riskScore: number;
  threatVector: string;
  recommendedAction: string;
  confidence: number;
}

const SecurityMonitoringDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    botAttempts: 0,
    blockedIPs: 0,
    geographicBlocks: 0,
    threatLevel: 'low',
    encryptionFailures: 0,
    watermarkViolations: 0,
    activeThreats: 0,
    lastUpdate: Date.now()
  });
  
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [threatAnalysis, setThreatAnalysis] = useState<ThreatAnalysis>({
    riskScore: 0,
    threatVector: 'none',
    recommendedAction: 'monitor',
    confidence: 0
  });
  
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alertSound, setAlertSound] = useState(true);
  
  const botProtectionRef = useRef<AdvancedBotProtection | null>(null);
  const contentEncryptionRef = useRef<ContentEncryption | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeSecuritySystems();
    setupEventListeners();
    
    if (autoRefresh) {
      startAutoRefresh();
    }

    return () => {
      cleanupSecuritySystems();
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const initializeSecuritySystems = () => {
    try {
      botProtectionRef.current = new AdvancedBotProtection();
      contentEncryptionRef.current = new ContentEncryption();
      console.log('🔒 Security systems initialized');
    } catch (error) {
      console.error('Failed to initialize security systems:', error);
    }
  };

  const setupEventListeners = () => {
    // Listen for security metrics updates
    window.addEventListener('securityMetrics', (event: any) => {
      updateSecurityMetrics(event.detail);
    });

    // Listen for security alerts
    window.addEventListener('securityAlert', (event: any) => {
      handleSecurityAlert(event.detail);
    });

    // Listen for watermark violations
    window.addEventListener('watermarkViolation', (event: any) => {
      handleWatermarkViolation(event.detail);
    });
  };

  const updateSecurityMetrics = (metrics: any) => {
    setSecurityMetrics(prev => ({
      ...prev,
      ...metrics,
      lastUpdate: Date.now()
    }));
    
    // Update threat analysis
    analyzeThreats();
  };

  const handleSecurityAlert = (alert: any) => {
    const newEvent: SecurityEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: alert.type,
      severity: determineSeverity(alert.type),
      message: generateAlertMessage(alert),
      timestamp: Date.now(),
      details: alert,
      resolved: false
    };

    setSecurityEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events
    
    // Play alert sound for high/critical events
    if (alertSound && (newEvent.severity === 'high' || newEvent.severity === 'critical')) {
      playAlertSound();
    }

    // Update metrics
    updateMetricsFromEvent(newEvent);
  };

  const handleWatermarkViolation = (violation: any) => {
    setSecurityMetrics(prev => ({
      ...prev,
      watermarkViolations: prev.watermarkViolations + 1
    }));
  };

  const determineSeverity = (type: string): 'low' | 'medium' | 'high' | 'critical' => {
    switch (type) {
      case 'bot_detection':
        return 'medium';
      case 'encryption_failure':
        return 'high';
      case 'watermark_violation':
        return 'critical';
      case 'geographic_block':
        return 'low';
      case 'suspicious_activity':
        return 'medium';
      default:
        return 'low';
    }
  };

  const generateAlertMessage = (alert: any): string => {
    switch (alert.type) {
      case 'bot_detection':
        return `Bot activity detected: ${alert.data?.indicators?.join(', ') || 'Unknown pattern'}`;
      case 'encryption_failure':
        return `Content encryption failed: ${alert.data?.error || 'Unknown error'}`;
      case 'watermark_violation':
        return `Watermark integrity compromised: ${alert.data?.failures || 0} violations detected`;
      case 'geographic_block':
        return `Access blocked from restricted region: ${alert.data?.countryCode || 'Unknown'}`;
      case 'suspicious_activity':
        return `Suspicious user behavior detected: ${alert.data?.pattern || 'Unknown pattern'}`;
      default:
        return `Security alert: ${alert.type}`;
    }
  };

  const updateMetricsFromEvent = (event: SecurityEvent) => {
    setSecurityMetrics(prev => {
      const updates: Partial<SecurityMetrics> = {};
      
      switch (event.type) {
        case 'bot_detection':
          updates.botAttempts = prev.botAttempts + 1;
          break;
        case 'encryption_failure':
          updates.encryptionFailures = prev.encryptionFailures + 1;
          break;
        case 'watermark_violation':
          updates.watermarkViolations = prev.watermarkViolations + 1;
          break;
        case 'geographic_block':
          updates.geographicBlocks = prev.geographicBlocks + 1;
          break;
      }
      
      return { ...prev, ...updates };
    });
  };

  const analyzeThreats = () => {
    const riskFactors = [
      securityMetrics.botAttempts * 10,
      securityMetrics.encryptionFailures * 20,
      securityMetrics.watermarkViolations * 50,
      securityMetrics.geographicBlocks * 5
    ];
    
    const totalRisk = riskFactors.reduce((sum, factor) => sum + factor, 0);
    const riskScore = Math.min(totalRisk, 100);
    
    let threatVector = 'none';
    let recommendedAction = 'monitor';
    let confidence = 0;
    
    if (riskScore > 80) {
      threatVector = 'multiple_high_risk';
      recommendedAction = 'immediate_response';
      confidence = 95;
    } else if (riskScore > 60) {
      threatVector = 'elevated_risk';
      recommendedAction = 'investigate';
      confidence = 80;
    } else if (riskScore > 30) {
      threatVector = 'moderate_risk';
      recommendedAction = 'monitor_closely';
      confidence = 65;
    } else if (riskScore > 10) {
      threatVector = 'low_risk';
      recommendedAction = 'continue_monitoring';
      confidence = 45;
    }
    
    setThreatAnalysis({
      riskScore,
      threatVector,
      recommendedAction,
      confidence
    });
  };

  const startAutoRefresh = () => {
    refreshIntervalRef.current = setInterval(() => {
      if (botProtectionRef.current) {
        const metrics = botProtectionRef.current.getSecurityMetrics();
        updateSecurityMetrics(metrics);
      }
    }, 5000); // Refresh every 5 seconds
  };

  const cleanupSecuritySystems = () => {
    if (botProtectionRef.current) {
      botProtectionRef.current.destroy();
    }
    if (contentEncryptionRef.current) {
      contentEncryptionRef.current.destroy();
    }
  };

  const playAlertSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.play();
    } catch (error) {
      console.warn('Could not play alert sound:', error);
    }
  };

  const resolveEvent = (eventId: string) => {
    setSecurityEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, resolved: true } : event
      )
    );
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-l-green-500';
      case 'medium': return 'border-l-yellow-500';
      case 'high': return 'border-l-orange-500';
      case 'critical': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg z-50"
        title="Security Dashboard"
      >
        🚨
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-6xl w-full max-h-full overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">🔒 Security Monitoring Dashboard</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-red-200"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Security Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{securityMetrics.botAttempts}</div>
              <div className="text-sm text-blue-600">Bot Attempts</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{securityMetrics.encryptionFailures}</div>
              <div className="text-sm text-red-600">Encryption Failures</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{securityMetrics.watermarkViolations}</div>
              <div className="text-sm text-orange-600">Watermark Violations</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{securityMetrics.geographicBlocks}</div>
              <div className="text-sm text-purple-600">Geographic Blocks</div>
            </div>
          </div>

          {/* Threat Analysis */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3">🎯 Threat Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Risk Score</div>
                <div className="text-2xl font-bold text-red-600">{threatAnalysis.riskScore}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Threat Vector</div>
                <div className="text-lg font-semibold">{threatAnalysis.threatVector.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Recommended Action</div>
                <div className="text-lg font-semibold">{threatAnalysis.recommendedAction.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
                <div className="text-lg font-semibold">{threatAnalysis.confidence}%</div>
              </div>
            </div>
          </div>

          {/* Current Threat Level */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">⚠️ Current Threat Level</h3>
            <div className={`inline-block px-4 py-2 rounded-lg font-bold ${getThreatLevelColor(securityMetrics.threatLevel)}`}>
              {securityMetrics.threatLevel.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Last updated: {new Date(securityMetrics.lastUpdate).toLocaleTimeString()}
            </div>
          </div>

          {/* Security Events */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">🚨 Security Events</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {securityEvents.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No security events detected</div>
              ) : (
                securityEvents.map(event => (
                  <div
                    key={event.id}
                    className={`border-l-4 p-3 bg-gray-50 dark:bg-gray-800 ${getSeverityColor(event.severity)} ${
                      event.resolved ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold">{event.message}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Type: {event.type} | Severity: {event.severity}
                        </div>
                      </div>
                      {!event.resolved && (
                        <button
                          onClick={() => resolveEvent(event.id)}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => {
                  setAutoRefresh(e.target.checked);
                  if (e.target.checked) {
                    startAutoRefresh();
                  } else if (refreshIntervalRef.current) {
                    clearInterval(refreshIntervalRef.current);
                  }
                }}
                className="mr-2"
              />
              Auto-refresh metrics
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={alertSound}
                onChange={(e) => setAlertSound(e.target.checked)}
                className="mr-2"
              />
              Alert sounds
            </label>

            <button
              onClick={() => {
                if (botProtectionRef.current) {
                  const metrics = botProtectionRef.current.getSecurityMetrics();
                  updateSecurityMetrics(metrics);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Now
            </button>

            <button
              onClick={() => {
                setSecurityEvents([]);
                setSecurityMetrics({
                  botAttempts: 0,
                  blockedIPs: 0,
                  geographicBlocks: 0,
                  threatLevel: 'low',
                  encryptionFailures: 0,
                  watermarkViolations: 0,
                  activeThreats: 0,
                  lastUpdate: Date.now()
                });
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoringDashboard;
