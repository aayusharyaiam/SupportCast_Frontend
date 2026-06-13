import VideoTile from './VideoTile';

export default function VideoGrid({ localStream, remoteStream }) {
  const hasRemote = !!remoteStream;

  return (
    <div className="grid gap-4 h-full" style={{ gridTemplateColumns: hasRemote ? '1fr 1fr' : '1fr' }}>
      <VideoTile stream={localStream} label="You" isLocal />
      {hasRemote && <VideoTile stream={remoteStream} label="Customer" />}
    </div>
  );
}