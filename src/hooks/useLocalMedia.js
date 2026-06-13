import { useState, useRef, useCallback, useEffect } from 'react';

export function useLocalMedia() {
  const localStreamRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const getUserMedia = useCallback(async (constraints = {}) => {
    setIsRequestingPermission(true);
    setMediaError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: constraints.video ?? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: constraints.audio ?? {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      localStreamRef.current = stream;
      setIsMediaReady(true);
      setIsRequestingPermission(false);
      return stream;
    } catch (error) {
      console.error('Failed to get user media:', error);
      setMediaError(error);
      setIsMediaReady(false);
      setIsRequestingPermission(false);
      return null;
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  const muteAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = false;
        setIsAudioEnabled(false);
      }
    }
  }, []);

  const unmuteAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = true;
        setIsAudioEnabled(true);
      }
    }
  }, []);

  const disableVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = false;
        setIsVideoEnabled(false);
      }
    }
  }, []);

  const enableVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = true;
        setIsVideoEnabled(true);
      }
    }
  }, []);

  const stopMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setIsMediaReady(false);
      setIsAudioEnabled(true);
      setIsVideoEnabled(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, [stopMedia]);

  return {
    localStream: localStreamRef.current,
    isAudioEnabled,
    isVideoEnabled,
    isMediaReady,
    mediaError,
    isRequestingPermission,
    getUserMedia,
    toggleAudio,
    toggleVideo,
    muteAudio,
    unmuteAudio,
    disableVideo,
    enableVideo,
    stopMedia,
  };
}