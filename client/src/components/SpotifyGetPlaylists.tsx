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

    async function findMostCommonWords(lyrics_string) {
        // traverses the string and returns an array of all of the words without the spaces or extra characters
        const words_array = lyrics_string.toLowerCase().split(/\s+/).filter(word => word.length > 0)
        const words = new Map();

        async function detectLanguage(text) {
            const response = await axios.post('http://localhost:3000/detect-language', { text });
            return response.data.language;
        }

        async function translateText(text, targetLanguage) {
            try {
                const response = await axios.post('http://localhost:3000/translate-text', { text, target: targetLanguage });
                return response.data.translations;
            } catch (error) {
                console.error('Translation error:', error);
                return null;
            }
        }
    
        // let language = await detectLanguage(lyrics_string);
        // console.log(language);
    
        for (let word of words_array) {
            if (words.has(word)) {
                words.set(word, words.get(word) + 1);
            } else {
                words.set(word, 1);
            }
        }
    
        let sorted_words = Array.from(words.entries())
            .sort((a, b) => b[1] - a[1])
        
        let top_10_words = [];

        let j = 0;
        for (let i = 0; i < sorted_words.length && top_10_words.length < 10; i++) {
            let word = sorted_words[i][0];
            let count = sorted_words[i][1];

            let word_language = await detectLanguage(word);
    
            console.log(`Language of '${word}' is: ${word_language}`);
    
            if (word_language != 'en') {
                top_10_words.push([word, count]);

                // translate to english
                let translation = await translateText(word, 'en');
                
                // change the count to the translated word
                top_10_words[j][1] = translation[0];
                j++;
            }
        }
        console.log(top_10_words);
        

    };

    const handleTrackClick = (trackId) => {
        setSelectedTrackId(trackId);

        axios
            .get(`https://api.spotify.com/v1/tracks/${trackId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            .then((response) => {
                let trackDetails = response.data;
    
                let trackName = trackDetails.name;
                let artistName = trackDetails.artists[0].name;
                console.log("HELLO!")
                const options = {
                    apiKey: 'wzTVvJ9dWy8iYMzWlpzGgd7VUjI4rpeGOaY5sjsIsvih7TPes-k_oMjLENA14V5Y',
                    title: trackName,
                    artist: artistName,
                    optimizeQuery: true
                }
            
                getSong(options).then((song) => {
                    console.log(song);
                    let lyrics_string = song.lyrics ? `${song.lyrics}` : '';
                    console.log(lyrics_string);
                    findMostCommonWords(lyrics_string);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        handleGetPlaylists();
    }, []);

    const [tracks, setTracks] = useState([]);

    const handlePlaylistClick = async (playlistId) => {
    let trackArtistsMap = new Map();

    axios
        .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then((response) => {
            // Set the fetched tracks to the state
            setTracks(response.data.items.map(item => {
                return {
                    ...item,
                    image: item.track.album.images[0]?.url // Get the URL of the first image
                };
            }));
        })
        .catch((error) => {
            console.log(error);
        });
    };

    // const handlePlaylistClick = async (playlistId) => {
    //     let trackArtistsMap = new Map();

    //     axios
    //         .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //             }
    //         })
    //         .then((response) => {
    //             const tracks = response.data.items;
    //             console.log(tracks);
    //             for (let track of tracks) {
    //                 console.log(track);
    //                 axios
    //                     .get(`https://api.spotify.com/v1/tracks/${track.track.id}`, {
    //                         headers: {
    //                             'Authorization': `Bearer ${token}`,
    //                         }
    //                     })
    //                     .then((response) => {
    //                         let trackDetails = response.data;
                
    //                         let trackName = trackDetails.name;
    //                         let artistName = trackDetails.artists[0].name;
    //                         console.log("HELLO!")
                
    //                         trackArtistsMap.set(trackName, artistName);
    //                         for (let [trackName, artistName] of trackArtistsMap) {
    //                             const options = {
    //                                 apiKey: 'wzTVvJ9dWy8iYMzWlpzGgd7VUjI4rpeGOaY5sjsIsvih7TPes-k_oMjLENA14V5Y',
    //                                 title: trackName,
    //                                 artist: artistName,
    //                                 optimizeQuery: true
    //                             }
                            
    //                             getSong(options).then((song) => {
    //                                 console.log(song);
    //                                 let lyrics_string = song.lyrics ? `${song.lyrics}` : '';
    //                                 console.log(franc(lyrics_string));
    //                             });
    //                         }
    //                     })
    //                     .catch((error) => {
    //                         console.log(error);
    //                     });
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

    return (
        <div className="flex flex-col">
        {tracks.length > 0 ? (
            tracks.map((trackItem) => (
                <div key={trackItem.track.id} className="flex my-2">
                    <img src={trackItem.image} alt={trackItem.track.name} className="w-12 mr-2 rounded" />
                    <button className="btn btn-outline btn-secondary flex-grow" onClick={() => handleTrackClick(trackItem.track.id)}>{trackItem.track.name}</button>
                    {selectedTrackId === trackItem.track.id}
                </div>
            ))
        ) : (
            playlists.map((playlist) => (
                <div key={playlist.id} className="flex my-2">
                    <img src={playlist.image} alt={playlist.name} className="w-12 mr-2 rounded" />
                    <button className="btn btn-outline btn-secondary flex-grow" onClick={() => handlePlaylistClick(playlist.id)}>
                        {playlist.name}
                    </button>
                </div>
            ))
        )}
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