const PlaylistHeader = ({ currentView }) => {
    let title = "Your Playlists";
    let instruction = "Select a playlist to dive in!";
    
    if (currentView === 'tracks') {
        title = "Your Tracks";
        instruction = "Select a track!";
    }

    if (currentView === 'topWords') {
        title = "Your Top Words";
        instruction = "Here they are!";
    }

    return (
        <div>
            <div className="playlist-header">
                <h2 className="title text-2xl">
                    {title}
                </h2>
            </div>
            <div className="playlist-instructions mb-4">
                <p className="italic hover:not-italic">
                    {instruction}
                </p>
            </div>
        </div>
    );
};

export default PlaylistHeader;
