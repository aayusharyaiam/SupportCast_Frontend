import { useState, useCallback, useRef, useEffect } from 'react';

const QUALITY_THRESHOLDS = {
  excellent: { maxLoss: 1, maxJitter: 50 },
  good: { maxLoss: 2, maxJitter: 100 },
  fair: { maxLoss: 5, maxJitter: 200 },
};

export function useConnectionQuality(peerConnection) {
  const [quality, setQuality] = useState('excellent');
  const [stats, setStats] = useState({ packetLoss: 0, jitter: 0 });
  const intervalRef = useRef(null);

  const calculateQuality = useCallback((packetLoss, jitter) => {
    if (packetLoss < QUALITY_THRESHOLDS.excellent.maxLoss && jitter < QUALITY_THRESHOLDS.excellent.maxJitter) {
      return 'excellent';
    }
    if (packetLoss < QUALITY_THRESHOLDS.good.maxLoss && jitter < QUALITY_THRESHOLDS.good.maxJitter) {
      return 'good';
    }
    if (packetLoss < QUALITY_THRESHOLDS.fair.maxLoss && jitter < QUALITY_THRESHOLDS.fair.maxJitter) {
      return 'fair';
    }
    return 'poor';
  }, []);

  const getStats = useCallback(async () => {
    if (!peerConnection) return;

    try {
      const statsData = await peerConnection.getStats();
      let totalPacketsLost = 0;
      let totalPacketsReceived = 0;
      let currentJitter = 0;

      statsData.forEach((report) => {
        if (report.type === 'inbound-rtp' && report.kind === 'video') {
          totalPacketsLost = report.packetsLost || 0;
          totalPacketsReceived = report.packetsReceived || 0;
          currentJitter = report.jitter || 0;
        }
      });

      const packetLoss = totalPacketsReceived > 0
        ? (totalPacketsLost / (totalPacketsLost + totalPacketsReceived)) * 100
        : 0;

      setStats({ packetLoss, jitter: currentJitter });
      setQuality(calculateQuality(packetLoss, currentJitter));
    } catch (error) {
      console.error('Failed to get connection stats:', error);
    }
  }, [peerConnection, calculateQuality]);

  useEffect(() => {
    if (!peerConnection) return;

    intervalRef.current = setInterval(getStats, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [peerConnection, getStats]);

  return { quality, stats };
}