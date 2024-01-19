import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SongComponent from "./SongComponent";
import getLyrics from "../lib/getLyrics.js";
import getSong from "../lib/getSong.js";
import TopWords from './TopWords';
import Track from './Track';
import Playlist from './Playlist';

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const SpotifyGetPlaylists = ({ token }) => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [selectedTrackId, setSelectedTrackId] = useState(null);

    const handleGetPlaylists = () => {
        axios.get('http://localhost:3000/spotify-playlists', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setPlaylists(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    };

    const [top10Words, setTop10Words] = useState([]);


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

        for (let word of words_array) {
            if (words.has(word)) {
                words.set(word, words.get(word) + 1);
            } else {
                words.set(word, 1);
            }
        }
    
        let sorted_words = Array.from(words.entries())
            .sort((a, b) => b[1] - a[1])
        
        let newTop10Words = [];

        let j = 0;
        for (let i = 0; i < sorted_words.length && newTop10Words.length < 10; i++) {
            let word = sorted_words[i][0];
            let count = sorted_words[i][1];

            let word_language = await detectLanguage(word);
    
            console.log(`Language of '${word}' is: ${word_language}`);
    
            if (word_language != 'en') {
                newTop10Words.push([word, count]);

                // translate to english
                let translation = await translateText(word, 'en');
                
                // change the count to the translated word
                newTop10Words[j][1] = translation[0];
                j++;
            }
        }
        console.log(newTop10Words);
        setTop10Words(newTop10Words);
        

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
            // set the fetched tracks to the state
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

    return (
        <div className="flex flex-col">
            {tracks.length > 0 ? (
                <>
                    {top10Words.length > 0 ? (
                        <TopWords words={top10Words} />
                    ) : (
                        <div className="flex my-2">
                            <button className="cursor-none btn btn-outline btn-secondary flex-grow">Loading top words...</button>
                        </div>
                    )}
                    {tracks.map(trackItem => (
                        <Track key={trackItem.track.id} track={trackItem} onTrackClick={handleTrackClick} />
                    ))}
                </>
            ) : (
                playlists.map(playlist => (
                    <Playlist key={playlist.id} playlist={playlist} onPlaylistClick={handlePlaylistClick} />
                ))
            )}
        </div>
    );
};

export default SpotifyGetPlaylists;