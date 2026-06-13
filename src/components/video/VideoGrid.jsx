import VideoTile from './VideoTile';

export default function VideoGrid({ localStream, remotePeers = [] }) {
  const hasRemote = remotePeers.length > 0;

  return (
    <div className={`h-full flex flex-col sm:flex-row gap-2 sm:gap-3 ${hasRemote ? '' : 'items-center justify-center'}`}>
      {hasRemote && (
        <div className="flex-1 min-h-0 min-w-0 flex flex-wrap gap-2 justify-center items-center">
          {remotePeers.map(peer => (
            <div key={peer.id} className="flex-1 min-w-[200px] h-full max-h-full">
              <VideoTile stream={peer.stream} label={peer.name || 'Participant'} />
            </div>
          ))}
        </div>
      )}
      <div className={hasRemote ? 'h-[30%] sm:h-full sm:w-[30%] min-h-0 min-w-0 shrink-0' : 'w-full max-w-2xl h-full'}>
        <VideoTile stream={localStream} label="You" isLocal />
      </div>
    </div>
  );
}
