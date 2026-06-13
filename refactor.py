import re

with open('src/pages/SessionView.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    'const [remoteStream, setRemoteStream] = useState(null);',
    'const [remotePeers, setRemotePeers] = useState({});'
)
code = code.replace(
    'const remoteStreamRef = useRef(new MediaStream());',
    'const remoteStreamsRef = useRef(new Map());'
)

code = code.replace(
    '''  const resetRemoteMedia = useCallback(() => {
    remoteStreamRef.current.getTracks().forEach((track) => track.stop());
    remoteStreamRef.current = new MediaStream();
    consumedProducerIdsRef.current.clear();
    pendingProducerIdsRef.current.clear();
    setRemoteStream(null);
  }, []);''',
    '''  const resetRemoteMedia = useCallback(() => {
    remoteStreamsRef.current.forEach((stream) => {
      stream.getTracks().forEach((track) => track.stop());
    });
    remoteStreamsRef.current.clear();
    consumedProducerIdsRef.current.clear();
    pendingProducerIdsRef.current.clear();
    setRemotePeers({});
  }, []);'''
)

code = code.replace(
    '''  const attachRemoteTrack = useCallback((track) => {
    const nextStream = new MediaStream(remoteStreamRef.current.getTracks());
    nextStream.addTrack(track);
    remoteStreamRef.current = nextStream;
    setRemoteStream(nextStream);
  }, []);''',
    '''  const attachRemoteTrack = useCallback((track, participantId) => {
    if (!participantId) return;
    
    let stream = remoteStreamsRef.current.get(participantId);
    if (!stream) {
      stream = new MediaStream();
      remoteStreamsRef.current.set(participantId, stream);
    }
    
    const nextStream = new MediaStream(stream.getTracks());
    nextStream.addTrack(track);
    remoteStreamsRef.current.set(participantId, nextStream);
    
    setRemotePeers(prev => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        stream: nextStream,
        id: participantId
      }
    }));
  }, []);'''
)

code = code.replace(
    '''  const consumeRemoteProducer = useCallback(async (transport, producerId) => {
    if (!transport || !producerId || consumedProducerIdsRef.current.has(producerId)) return;
    consumedProducerIdsRef.current.add(producerId);

    try {
      const consumer = await consume(transport, producerId, sessionId, emit);
      attachRemoteTrack(consumer.track);
    } catch (error) {
      consumedProducerIdsRef.current.delete(producerId);
      throw error;
    }
  }, [attachRemoteTrack, consume, emit, sessionId]);''',
    '''  const consumeRemoteProducer = useCallback(async (transport, producerId, participantId) => {
    if (!transport || !producerId || consumedProducerIdsRef.current.has(producerId)) return;
    consumedProducerIdsRef.current.add(producerId);

    try {
      const consumer = await consume(transport, producerId, sessionId, emit);
      attachRemoteTrack(consumer.track, participantId);
    } catch (error) {
      consumedProducerIdsRef.current.delete(producerId);
      throw error;
    }
  }, [attachRemoteTrack, consume, emit, sessionId]);'''
)

code = code.replace(
    '''    if (joinedData.participants?.[0]) {
      setRemoteParticipant({
        id: joinedData.participants[0].participantId,
        name: joinedData.participants[0].name,
        role: joinedData.participants[0].role,
      });
      showInfo(${joinedData.participants[0].name || 'Participant'} is already in the call);
    }''',
    '''    if (joinedData.participants?.length > 0) {
      const newPeers = {};
      joinedData.participants.forEach(p => {
        newPeers[p.participantId] = { id: p.participantId, name: p.name, role: p.role, stream: remoteStreamsRef.current.get(p.participantId) || new MediaStream() };
      });
      setRemotePeers(prev => ({ ...prev, ...newPeers }));
      showInfo(${joinedData.participants.length} participant(s) already in the call);
    }'''
)

code = code.replace(
    '''    const participantJoined = on('participant-joined', (data) => {
      setRemoteParticipant({
        id: data.participantId,
        name: data.name,
        role: data.role,
      });
      showInfo(${data.name} joined the call);
    });''',
    '''    const participantJoined = on('participant-joined', (data) => {
      setRemotePeers(prev => ({
        ...prev,
        [data.participantId]: {
          id: data.participantId,
          name: data.name,
          role: data.role,
          stream: remoteStreamsRef.current.get(data.participantId) || new MediaStream()
        }
      }));
      showInfo(${data.name} joined the call);
    });'''
)

code = code.replace(
    '''    const participantLeft = on('participant-left', (data) => {
      clearRemoteParticipant();
      resetRemoteMedia();
      showInfo(data.name ? ${data.name} left the call : 'Participant left the call');
    });''',
    '''    const participantLeft = on('participant-left', (data) => {
      setRemotePeers(prev => {
        const next = { ...prev };
        delete next[data.participantId];
        return next;
      });
      
      const stream = remoteStreamsRef.current.get(data.participantId);
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        remoteStreamsRef.current.delete(data.participantId);
      }
      
      showInfo(data.name ? ${data.name} left the call : 'Participant left the call');
    });'''
)

code = code.replace(
    '''    const newProducer = on('new-producer', async (data) => {
      try {
        if (!recvTransport) {
          pendingProducerIdsRef.current.add(data.producerId);
          return;
        }
        await consumeRemoteProducer(recvTransport, data.producerId);
      } catch (error) {
        showError('Failed to receive participant media', getErrorDetails(error));
      }
    });''',
    '''    const newProducer = on('new-producer', async (data) => {
      try {
        if (!recvTransport) {
          pendingProducerIdsRef.current.add({ producerId: data.producerId, participantId: data.participantId });
          return;
        }
        await consumeRemoteProducer(recvTransport, data.producerId, data.participantId);
      } catch (error) {
        showError('Failed to receive participant media', getErrorDetails(error));
      }
    });'''
)

code = code.replace(
    '''  useEffect(() => {
    if (!recvTransport) return;

    const producerIds = [...pendingProducerIdsRef.current];
    pendingProducerIdsRef.current.clear();

    producerIds.forEach((producerId) => {
      consumeRemoteProducer(recvTransport, producerId).catch(() => {
        showError('Failed to receive participant media');
      });
    });
  }, [recvTransport, consumeRemoteProducer, showError]);''',
    '''  useEffect(() => {
    if (!recvTransport) return;

    const pending = [...pendingProducerIdsRef.current];
    pendingProducerIdsRef.current.clear();

    pending.forEach(({ producerId, participantId }) => {
      consumeRemoteProducer(recvTransport, producerId, participantId).catch(() => {
        showError('Failed to receive participant media');
      });
    });
  }, [recvTransport, consumeRemoteProducer, showError]);'''
)

code = code.replace(
    '''      for (const producer of joinedData?.producers || []) {
        setRemoteParticipant({
          id: producer.participantId,
          name: producer.name || 'Participant',
          role: producer.role || 'participant',
        });
        await consumeRemoteProducer(activeRecvTransport, producer.producerId);
      }''',
    '''      for (const producer of joinedData?.producers || []) {
        setRemotePeers(prev => ({
          ...prev,
          [producer.participantId]: {
            ...prev[producer.participantId],
            id: producer.participantId,
            name: producer.name || 'Participant',
            role: producer.role || 'participant'
          }
        }));
        await consumeRemoteProducer(activeRecvTransport, producer.producerId, producer.participantId);
      }'''
)

code = code.replace(
    '''          <VideoGrid
            localStream={localStream}
            remoteStream={remoteStream}
            remoteParticipant={remoteParticipant}
          />''',
    '''          <VideoGrid
            localStream={localStream}
            remotePeers={Object.values(remotePeers)}
          />'''
)

code = code.replace(
    '''  const participantStatus = remoteParticipant
    ? ${remoteParticipant.name || 'Participant'} joined
    : 'Waiting for another participant';''',
    '''  const peersCount = Object.keys(remotePeers).length;
  const participantStatus = peersCount > 0
    ? ${peersCount} participant joined
    : 'Waiting for another participant';'''
)

code = code.replace(
    '''              className={	ext-xs px-3 py-1 rounded-full border transition-all duration-300 }''',
    '''              className={	ext-xs px-3 py-1 rounded-full border transition-all duration-300 }'''
)

with open('src/pages/SessionView.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
