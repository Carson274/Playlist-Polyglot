const PlaylistHeader = () => {
    return (
        <div>
            <div className="playlist-header">
                <h2 className="title text-2xl">
                    {"Your Playlists"}
                </h2>
            </div>
            <div className="playlist-instructions mb-4">
                <p className="italic hover:not-italic">
                    {"Select a playlist to dive in!"}
                </p>
            </div>
        </div>
    );
};

export default PlaylistHeader;