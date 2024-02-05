import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SongComponent from "./SongComponent";
import getLyrics from "../lib/getLyrics.js";
import getSong from "../lib/getSong.js";
import TopWords from './TopWords';
import Track from './Track';
import Playlist from './Playlist';

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const SpotifyGetPlaylists = ({ token, currentView, setCurrentView }) => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const handleGetPlaylists = () => {
        axios.get('https://playlist-polyglot.onrender.com/spotify-playlists', {
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
            const response = await axios.post('https://playlist-polyglot.onrender.com/detect-language', { text });
            return response.data.language;
        }

        async function translateText(text, targetLanguage) {
            try {
                const response = await axios.post('https://playlist-polyglot.onrender.com/translate-text', { text, target: targetLanguage });
                return response.data.translations;
            } catch (error) {
                console.error('Translation error:', error);
                return null;
            }
        }

        let lyrics_language = await detectLanguage(lyrics_string);
        console.log(lyrics_language);

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
    
            if(lyrics_language != 'en') {
                if (word_language == lyrics_language) {
                    newTop10Words.push([word, count]);
    
                    // translate to english
                    let translation = await translateText(word, 'en');
                    
                    // change the count to the translated word
                    newTop10Words[j][1] = translation[0];
                    j++;
                }
            } else {
                if (word_language != 'en') {
                    newTop10Words.push([word, count]);

                    // translate to english
                    let translation = await translateText(word, 'en');
                    
                    // change the count to the translated word
                    newTop10Words[j][1] = translation[0];
                    j++;
                }
            }
        }
        setIsLoading(false);
        console.log(newTop10Words);
        setTop10Words(newTop10Words);
    };

    const handleTrackClick = (trackId) => {
        setSelectedTrackId(trackId);
        setTracks([]);
        setIsLoading(true);

        axios
            .get(`https://playlist-polyglot.onrender.com/spotify-track/${trackId}`, {
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
        
        setCurrentView('topWords');
    };

    useEffect(() => {
        handleGetPlaylists();
    }, []);

    const [tracks, setTracks] = useState([]);

    const handlePlaylistClick = async (playlistId) => {
        // set loading while axios gets the playlists
        setIsLoading(true);
        axios
            .get(`https://playlist-polyglot.onrender.com/spotify-playlist-tracks/${playlistId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            .then((response) => {
                // set the fetched tracks to the state
                setTracks(response.data.items.map(item => {
                    return {
                        ...item,
                        image: item.track.album.images[0]?.url // get the URL of the first image
                    };
                }));
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });

        setCurrentView('tracks');
    };

    const handleBackToTracks = () => {
        setCurrentView('tracks');
    };

    const handleBackToPlaylists = () => {
        setCurrentView('playlists');
    };

    return (
        <div className="flex flex-col">
            {isLoading && (
                <div className="flex justify-center items-center h-full w-full">
                    <span className="loading loading-ring loading-lg text-primary"></span>
                </div>
            )}
            {!isLoading && currentView === 'playlists' && playlists.map(playlist => (
                <Playlist key={playlist.id} playlist={playlist} onPlaylistClick={handlePlaylistClick} />
            ))}
            {!isLoading && currentView === 'tracks' && tracks.map(trackItem => (
                <Track key={trackItem.track.id} track={trackItem} onTrackClick={handleTrackClick} />
            ))}
            {!isLoading && currentView === 'topWords' && <TopWords words={top10Words} />}
        </div>
    );
};

export default SpotifyGetPlaylists;