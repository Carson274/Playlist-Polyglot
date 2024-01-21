require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Translate } = require('@google-cloud/translate').v2;

const app = express();
const PORT = 3000;

const translate = new Translate({ key: process.env.GOOGLE_API_KEY });

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// get the lyrics of a song
app.get('/lyrics', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).send('URL is required');
        }

        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// detect the language of a word
app.post('/detect-language', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).send('Text is required');
        }

        const [detection] = await translate.detect(text);
        res.json({ language: detection.language });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// translate a word to english
app.post('/translate-text', async (req, res) => {
    try {
        const { text, target } = req.body;
        if (!text || !target) {
            return res.status(400).send('Text and target language are required');
        }

        let [translations] = await translate.translate(text, target);
        translations = Array.isArray(translations) ? translations : [translations];

        res.json({ translations });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// get playlists from spotify
app.get('/spotify-playlists', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send('Authorization token is required');
    }

    axios.get("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: token },
    })
    .then(response => {
        const fetchedPlaylists = response.data.items;
        const promises = fetchedPlaylists.map(playlist => {
            return axios.get(`https://api.spotify.com/v1/playlists/${playlist.id}/images`, {
                headers: { Authorization: token },
            })
            .then(imageResponse => ({ ...playlist, image: imageResponse.data[0]?.url }));
        });
        return Promise.all(promises);
    })
    .then(playlistsWithImages => res.json(playlistsWithImages))
    .catch(error => {
        console.error('Error fetching playlists:', error);
        res.status(500).send('Error fetching playlists');
    });
});

// get tracks from a specific Spotify playlist
app.get('/spotify-playlist-tracks/:playlistId', (req, res) => {
    const token = req.headers.authorization;
    const playlistId = req.params.playlistId;

    if (!token) {
        return res.status(401).send('Authorization token is required');
    }

    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { Authorization: token }
    })
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        console.error('Error fetching tracks:', error);
        res.status(500).send('Error fetching tracks');
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});