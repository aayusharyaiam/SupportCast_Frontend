import { useEffect, useCallback, useRef, useState } from 'react';
import { getSocket, disconnectSocket } from '../services/socket';
import { useUiStore } from '../store/uiStore';

export function useSocket(sessionId) {
  const socketRef = useRef(null);
  const [joinedData, setJoinedData] = useState(null);
  const setIsConnecting = useUiStore((state) => state.setIsConnecting);
  const setConnectionError = useUiStore((state) => state.setConnectionError);

  useEffect(() => {
    if (!sessionId) return;

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
            if (error || response?.ok === false) {
              setConnectionError(response?.error?.message || error?.message || 'Failed to join session');
              return;
            }
            setJoinedData(response?.data || null);
          }
        );
    };

    const onDisconnect = () => {
      setConnectionError('Disconnected from server');
    };

    const onConnectError = (error) => {
      setIsConnecting(false);
      setConnectionError(error.message);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, [sessionId, setIsConnecting, setConnectionError]);

  const emit = useCallback((event, data) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current?.connected) {
        reject(new Error('Socket is not connected'));
        return;
      }

      socketRef.current.timeout(10000).emit(event, data, (error, response) => {
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
      disconnectSocket();
    };
  }, []);

  return { emit, on, off, socket: socketRef.current, joinedData };
}
