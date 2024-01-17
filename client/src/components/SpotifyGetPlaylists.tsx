import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SongComponent from "./SongComponent";
import getLyrics from "../lib/getLyrics.js";
import getSong from "../lib/getSong.js";
import FormData from 'form-data';
import {franc, francAll} from 'franc';

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const SpotifyGetPlaylists = ({ token }) => {
    const [playlists, setPlaylists] = useState([]);
    // const [tracks, setTracks] = useState([]);
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

    const handlePlaylistClick = async (playlistId) => {
        let trackArtistsMap = new Map();

        axios
            .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            .then((response) => {
                const tracks = response.data.items;
                console.log(tracks);
                for (let track of tracks) {
                    console.log(track);
                    axios
                        .get(`https://api.spotify.com/v1/tracks/${track.track.id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            }
                        })
                        .then((response) => {
                            let trackDetails = response.data;
                
                            let trackName = trackDetails.name;
                            let artistName = trackDetails.artists[0].name;
                            console.log("HELLO!")
                
                            trackArtistsMap.set(trackName, artistName);
                            for (let [trackName, artistName] of trackArtistsMap) {
                                const options = {
                                    apiKey: 'wzTVvJ9dWy8iYMzWlpzGgd7VUjI4rpeGOaY5sjsIsvih7TPes-k_oMjLENA14V5Y',
                                    title: trackName,
                                    artist: artistName,
                                    optimizeQuery: true
                                }
                            
                                getSong(options).then((song) => {
                                    console.log(song);
                                    let lyrics_string = song.lyrics ? `${song.lyrics}` : '';
                                    console.log(franc(lyrics_string));
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });
                
        
                
        


    };

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