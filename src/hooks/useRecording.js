import { useCallback, useEffect } from 'react';
import { getSocket } from '../services/socket';
import { useSessionStore } from '../store/sessionStore';
import { useUiStore } from '../store/uiStore';

export function useRecording(sessionId, socket) {
  const activeSocket = socket || getSocket();
  const recordingStatus = useSessionStore((state) => state.recordingStatus);
  const recordingUrl = useSessionStore((state) => state.recordingUrl);
  const setRecordingStatus = useSessionStore((state) => state.setRecordingStatus);
  const setRecordingUrl = useSessionStore((state) => state.setRecordingUrl);
  const showError = useUiStore((state) => state.showError);
  const showSuccess = useUiStore((state) => state.showSuccess);
  const showInfo = useUiStore((state) => state.showInfo);

  useEffect(() => {
    if (!activeSocket || !sessionId) return;

    const handleRecordingStatus = (data) => {
      if (data.sessionId === sessionId) {
        setRecordingStatus(data.status);
        if (data.fileUrl) {
          setRecordingUrl(data.fileUrl);
        }
        if (data.status === 'recording') {
          showSuccess('Recording started');
        } else if (data.status === 'processing') {
          showInfo('Processing recording...');
        } else if (data.status === 'ready') {
          showSuccess('Recording ready');
        }
      }
    };

    const handleError = (error) => {
      if (error.code?.startsWith('RECORDING')) {
        showError(error.message);
        setRecordingStatus('error');
      }
    };

    activeSocket.on('recording-status', handleRecordingStatus);
    activeSocket.on('error', handleError);

    return () => {
      activeSocket.off('recording-status', handleRecordingStatus);
      activeSocket.off('error', handleError);
    };
  }, [activeSocket, sessionId, setRecordingStatus, setRecordingUrl, showError, showSuccess, showInfo]);

  const startRecording = useCallback(() => {
    if (activeSocket?.connected && sessionId) {
      activeSocket.timeout(10000).emit('start-recording', { sessionId }, (error, response) => {
        if (error || response?.ok === false) {
          showError(response?.error?.message || error?.message || 'Failed to start recording');
          setRecordingStatus('error');
        }
      });
    }
  }, [activeSocket, sessionId, setRecordingStatus, showError]);

  const stopRecording = useCallback(() => {
    if (activeSocket?.connected && sessionId) {
      activeSocket.timeout(30000).emit('stop-recording', { sessionId }, (error, response) => {
        if (error || response?.ok === false) {
          showError(response?.error?.message || error?.message || 'Failed to stop recording');
          setRecordingStatus('error');
        }
      });
    }
  }, [activeSocket, sessionId, setRecordingStatus, showError]);

  const isRecording = recordingStatus === 'recording';
  const isProcessing = recordingStatus === 'processing';

  return {
    recordingStatus,
    recordingUrl,
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
  };
}
