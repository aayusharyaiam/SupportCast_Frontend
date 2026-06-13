import { useEffect, useCallback, useRef, useState } from 'react';
import { getSocket, disconnectSocket } from '../services/socket';
import { getErrorDetails, useUiStore } from '../store/uiStore';

export function useSocket(sessionId) {
  const socketRef = useRef(null);
  const isDisposingRef = useRef(false);
  const [joinedData, setJoinedData] = useState(null);
  const isConnecting = useUiStore((state) => state.isConnecting);
  const setIsConnecting = useUiStore((state) => state.setIsConnecting);
  const setConnectionError = useUiStore((state) => state.setConnectionError);
  const showError = useUiStore((state) => state.showError);

  useEffect(() => {
    if (!sessionId) return;

    isDisposingRef.current = false;
    const socket = getSocket();
    socketRef.current = socket;

    setIsConnecting(true);

    const onConnect = () => {
      setIsConnecting(false);
      setConnectionError(null);
      socket
        .timeout(10000)
        .emit(
          'join-session',
          {
            sessionId,
            token: localStorage.getItem('socketToken') || localStorage.getItem('token'),
            name: localStorage.getItem('displayName') || 'User',
          },
          (error, response) => {
            if (isDisposingRef.current && error?.message === 'socket has been disconnected') {
              return;
            }

            if (error || response?.ok === false) {
              const message = response?.error?.message || error?.message || 'Failed to join session';
              setConnectionError(message);
              showError(message, getErrorDetails(response?.error || error));
              return;
            }
            setJoinedData(response?.data || null);
          }
        );
    };

    const onDisconnect = (reason) => {
      if (isDisposingRef.current || reason === 'io client disconnect') {
        return;
      }

      const message = 'Disconnected from server';
      setConnectionError(message);
      showError(message);
    };

    const onConnectError = (error) => {
      setIsConnecting(false);
      setConnectionError(error.message);
      showError('Failed to connect to session', getErrorDetails(error));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      isDisposingRef.current = true;
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, [sessionId, setIsConnecting, setConnectionError, showError]);

  const emit = useCallback((event, data) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current?.connected) {
        reject(new Error('Socket is not connected'));
        return;
      }

      socketRef.current.timeout(10000).emit(event, data, (error, response) => {
        if (isDisposingRef.current && error?.message === 'socket has been disconnected') {
          resolve(null);
          return;
        }

        if (error) {
          reject(error);
          return;
        }
        if (response?.ok === false) {
          reject(new Error(response.error?.message || 'Socket event failed'));
          return;
        }
        resolve(response?.data ?? response);
      });
    });
  }, []);

  const on = useCallback((event, handler) => {
    const socket = getSocket();
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    const socket = getSocket();
    if (handler) {
      socket.off(event, handler);
    } else {
      socket.off(event);
    }
  }, []);

  useEffect(() => {
    return () => {
      isDisposingRef.current = true;
      disconnectSocket();
    };
  }, []);

  return { emit, on, off, socket: socketRef.current, joinedData, isConnecting };
}
