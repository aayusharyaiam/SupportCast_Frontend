import VideoTile from './VideoTile';

export default function VideoGrid({ localStream, remoteStream, remoteParticipant }) {
  const hasRemote = !!remoteStream || !!remoteParticipant;
  const remoteLabel = remoteParticipant?.name || 'Participant';

  return (
    <div className={`h-full flex flex-col sm:flex-row gap-2 sm:gap-3 ${hasRemote ? '' : 'items-center justify-center'}`}>
      {hasRemote && (
        <div className="flex-1 min-h-0 min-w-0">
          <VideoTile stream={remoteStream} label={remoteLabel} />
        </div>
      )}
      <div className={hasRemote ? 'h-[30%] sm:h-full sm:w-[30%] min-h-0 min-w-0 shrink-0' : 'w-full max-w-2xl h-full'}>
        <VideoTile stream={localStream} label="You" isLocal />
      </div>
    </div>
  );
}
