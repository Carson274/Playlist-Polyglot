const Playlist = ({ playlist, onPlaylistClick }) => (
    <div className="flex my-2">
        <img src={playlist.image} alt={playlist.name} className="w-12 mr-2 rounded" />
        <button className="cursor-none btn btn-outline btn-secondary flex-grow" onClick={() => onPlaylistClick(playlist.id)}>
            {playlist.name}
        </button>
    </div>
);

export default Playlist;