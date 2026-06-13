import { useCallback, useEffect } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { useUiStore } from '../store/uiStore';

export function useRecording(sessionId, socket) {
  const recordingStatus = useSessionStore((state) => state.recordingStatus);
  const recordingUrl = useSessionStore((state) => state.recordingUrl);
  const setRecordingStatus = useSessionStore((state) => state.setRecordingStatus);
  const setRecordingUrl = useSessionStore((state) => state.setRecordingUrl);
  const showError = useUiStore((state) => state.showError);
  const showSuccess = useUiStore((state) => state.showSuccess);
  const showInfo = useUiStore((state) => state.showInfo);

  useEffect(() => {
    if (!socket || !sessionId) return;

    const handleRecordingStatus = (data) => {
      if (data.sessionId === sessionId) {
        setRecordingStatus(data.status);
        if (data.url) {
          setRecordingUrl(data.url);
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
      if (error.code === 'RECORDING_ERROR') {
        showError(error.message);
        setRecordingStatus('error');
      }
    };

    socket.on('recording-status', handleRecordingStatus);
    socket.on('error', handleError);

    return () => {
      socket.off('recording-status', handleRecordingStatus);
      socket.off('error', handleError);
    };
  }, [socket, sessionId, setRecordingStatus, setRecordingUrl, showError, showSuccess, showInfo]);

  const startRecording = useCallback(() => {
    if (socket?.connected && sessionId) {
      socket.emit('start-recording', { sessionId });
    }
  }, [socket, sessionId]);

  const stopRecording = useCallback(() => {
    if (socket?.connected && sessionId) {
      socket.emit('stop-recording', { sessionId });
    }
  }, [socket, sessionId]);

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
