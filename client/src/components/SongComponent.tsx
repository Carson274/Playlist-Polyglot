import React, { useState } from 'react';
import axios from 'axios';

const SongComponent = ({ token, trackId }) => {
    const [lyrics, setLyrics] = useState('');

    const handleGetLyrics = async () => {
        try {
            const response = await axios.get(`https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&vocalRemoval=false`, {
                headers: {
                    'app-platform': 'WebPlayer',
                    'authorization': `Bearer ${token}` // Replace YOUR_BEARER_TOKEN with your actual token
                }
            });
            // Assuming the response structure is similar to the one you provided
            const lines = response.data.lyrics.lines.map(line => line.words).join('\n');
            setLyrics(lines);
        } catch (error) {
            console.error(error);
            setLyrics('Lyrics not found.');
        }
    };

    return (
        <div>
            <button onClick={handleGetLyrics}>Get Lyrics</button>
            {lyrics && <p>{lyrics}</p>}
        </div>
    );
};

export default SongComponent;
