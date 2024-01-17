const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});