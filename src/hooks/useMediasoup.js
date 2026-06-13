import { useState, useRef, useCallback, useEffect } from 'react';
import * as mediasoupClient from 'mediasoup-client';

export function useMediasoup() {
  const deviceRef = useRef(null);
  const sendTransportRef = useRef(null);
  const recvTransportRef = useRef(null);
  const producersRef = useRef(new Map());
  const consumersRef = useRef(new Map());
  const iceServersRef = useRef(null);
  const [isProducerReady, setIsProducerReady] = useState(false);
  const [rtpCapabilities, setRtpCapabilities] = useState(null);

  const initializeDevice = useCallback(async (serverCaps) => {
    const device = new mediasoupClient.Device();
    await device.load({ routerRtpCapabilities: serverCaps });
    deviceRef.current = device;
    setRtpCapabilities(device.rtpCapabilities);
    return device;
  }, []);

  /**
   * Fetch ICE servers (STUN/TURN) from the backend and cache them.
   * TURN servers are critical when mediasoup's direct UDP/TCP ports are
   * unreachable (e.g., on Render.com).
   */
  const fetchIceServers = useCallback(async (emit) => {
    if (iceServersRef.current) return iceServersRef.current;
    try {
      const servers = await emit('get-ice-servers', {});
      iceServersRef.current = servers;
      return servers;
    } catch {
      // Fallback to Google STUN if backend doesn't support get-ice-servers
      const fallback = [{ urls: ['stun:stun.l.google.com:19302'] }];
      iceServersRef.current = fallback;
      return fallback;
    }
  }, []);

  const createSendTransport = useCallback(async (serverTransport, sessionId, emit) => {
    const device = deviceRef.current;
    if (!device) throw new Error('Device not initialized');

    const iceServers = await fetchIceServers(emit);

    const transport = device.createSendTransport({
      id: serverTransport.id,
      iceParameters: serverTransport.iceParameters,
      iceCandidates: serverTransport.iceCandidates,
      dtlsParameters: serverTransport.dtlsParameters,
      iceServers,
    });

    transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await emit('connect-transport', {
          sessionId,
          transportId: transport.id,
          dtlsParameters,
        });
        callback();
      } catch (error) {
        errback(error);
      }
    });

    transport.on('produce', async (parameters, callback, errback) => {
      try {
        const produced = await emit('produce', {
          sessionId,
          transportId: transport.id,
          kind: parameters.kind,
          rtpParameters: parameters.rtpParameters,
        });
        callback({ id: produced.producerId });
      } catch (error) {
        errback(error);
      }
    });

    sendTransportRef.current = transport;
    return transport;
  }, [fetchIceServers]);

  const createRecvTransport = useCallback(async (serverTransport, sessionId, emit) => {
    const device = deviceRef.current;
    if (!device) throw new Error('Device not initialized');

    const iceServers = await fetchIceServers(emit);

    const transport = device.createRecvTransport({
      id: serverTransport.id,
      iceParameters: serverTransport.iceParameters,
      iceCandidates: serverTransport.iceCandidates,
      dtlsParameters: serverTransport.dtlsParameters,
      iceServers,
    });

    transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await emit('connect-transport', {
          sessionId,
          transportId: transport.id,
          dtlsParameters,
        });
        callback();
      } catch (error) {
        errback(error);
      }
    });

    recvTransportRef.current = transport;
    return transport;
  }, [fetchIceServers]);

  const produce = useCallback(async (transport, track, _kind) => {
    const producer = await transport.produce({ track });
    producersRef.current.set(producer.id, producer);
    return producer;
  }, []);

  const consume = useCallback(async (transport, producerId, sessionId, emit) => {
    const device = deviceRef.current;
    if (!device) throw new Error('Device not initialized');

    const consumerOptions = await emit('consume', {
      sessionId,
      producerId,
      rtpCapabilities: device.rtpCapabilities,
    });

    const consumer = await transport.consume({
      producerId,
      id: consumerOptions.id,
      kind: consumerOptions.kind,
      rtpParameters: consumerOptions.rtpParameters,
    });

    await emit('resume-consumer', { sessionId, consumerId: consumer.id });

    consumersRef.current.set(consumer.id, consumer);
    return consumer;
  }, []);

  const closeProducer = useCallback((producerId) => {
    const producer = producersRef.current.get(producerId);
    if (producer) {
      producer.close();
      producersRef.current.delete(producerId);
    }
  }, []);

  const closeConsumer = useCallback((consumerId) => {
    const consumer = consumersRef.current.get(consumerId);
    if (consumer) {
      consumer.close();
      consumersRef.current.delete(consumerId);
    }
  }, []);

  const cleanup = useCallback(() => {
    producersRef.current.forEach((p) => p.close());
    consumersRef.current.forEach((c) => c.close());
    producersRef.current.clear();
    consumersRef.current.clear();

    if (sendTransportRef.current) {
      sendTransportRef.current.close();
      sendTransportRef.current = null;
    }
    if (recvTransportRef.current) {
      recvTransportRef.current.close();
      recvTransportRef.current = null;
    }
    deviceRef.current = null;
    iceServersRef.current = null;
    setIsProducerReady(false);
    setRtpCapabilities(null);
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    device: deviceRef.current,
    sendTransport: sendTransportRef.current,
    recvTransport: recvTransportRef.current,
    rtpCapabilities,
    isProducerReady,
    initializeDevice,
    createSendTransport,
    createRecvTransport,
    produce,
    consume,
    closeProducer,
    closeConsumer,
    cleanup,
  };
}
