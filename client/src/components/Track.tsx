const Track = ({ track, onTrackClick }) => (
    <div className="flex my-2">
        <img src={track.image} alt={track.track.name} className="w-12 mr-2 rounded" />
        <button className="cursor-none btn btn-outline btn-secondary flex-grow" onClick={() => onTrackClick(track.track.id)}>
            {track.track.name}
        </button>
    </div>
);

export default Track;