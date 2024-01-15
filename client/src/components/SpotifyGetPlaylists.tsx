import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SongComponent from "./SongComponent";

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const SpotifyGetPlaylists = ({ token }) => {
    const [playlists, setPlaylists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [selectedTrackId, setSelectedTrackId] = useState(null);

    const handleGetPlaylists = () => {
        axios
            .get(PLAYLIST_ENDPOINT, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((response) => {
                const fetchedPlaylists = response.data.items;
                const promises = fetchedPlaylists.map((playlist) =>
                    axios
                        .get(`https://api.spotify.com/v1/playlists/${playlist.id}/images`, {
                            headers: {
                                Authorization: "Bearer " + token,
                            },
                        })
                        .then((response) => {
                            const imageUrl = response.data[0]?.url; // Get the URL of the first image
                            return { ...playlist, image: imageUrl };
                        })
                );
    
                Promise.all(promises).then((playlistsWithImages) => {
                    setPlaylists(playlistsWithImages);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleTrackClick = (trackId) => {
        setSelectedTrackId(trackId);
    };

    useEffect(() => {
        handleGetPlaylists();
    }, []);

    return (
        <div className="flex flex-col">
            {playlists.map((playlist) => (
                <div key={playlist.id} className="flex my-2">
                    <img src={playlist.image} alt={playlist.name} className="w-12 mr-2 rounded" />
                    <button className="btn btn-outline btn-secondary flex-grow" onClick={() => handlePlaylistClick(playlist.id)}>
                        {playlist.name}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SpotifyGetPlaylists;

/* {selectedPlaylistId && (
    <div>
        <h2>Tracks in Playlist</h2>
        {tracks.map((trackItem) => (
            <div key={trackItem.track.id}>
                <p onClick={() => handleTrackClick(trackItem.track.id)}>{trackItem.track.name}</p>
                {selectedTrackId === trackItem.track.id && <SongComponent token={token} trackId={trackItem.track.id} />}
            </div>
        ))}
    </div>
)} */