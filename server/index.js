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
// app.use((req) => {
//     console.log(req);
// });

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});