import VideoTile from './VideoTile';

export default function VideoGrid({ localStream, remoteStream, remoteParticipant }) {
  const hasRemote = !!remoteStream || !!remoteParticipant;
  const remoteLabel = remoteParticipant?.name || 'Participant';

  return (
    <div className={`grid gap-4 h-full transition-all duration-500 ease-out grid-cols-1 ${hasRemote ? 'sm:grid-cols-2' : ''}`}>
      <VideoTile stream={localStream} label="You" isLocal />
      {hasRemote && <VideoTile stream={remoteStream} label={remoteLabel} />}
    </div>
  );
}
