import axios from 'axios';

/**
 * Parses HTML and extracts lyrics.
 * @param {string} html - The HTML string.
 * @returns {string} - Extracted lyrics.
 */
function extractLyrics(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let lyrics = doc.querySelector('div.lyrics')?.textContent?.trim() || '';

    if (!lyrics) {
        doc.querySelectorAll('div[class^="Lyrics__Container"]').forEach(elem => {
            const textContent = elem.textContent.trim();
            if (textContent) {
                lyrics += textContent + '\n\n';
            }
        });
    }

    return lyrics.trim() || null;
}

/**
 * Fetches lyrics from a Genius URL.
 * @param {string} url - Genius URL.
 * @returns {Promise<string|null>} - A promise that resolves to lyrics or null.
 */
export default async function (url) {
    try {
        const proxyUrl = `https://playlist-polyglot.onrender.com/lyrics?url=${encodeURIComponent(url)}`;
        let { data } = await axios.get(proxyUrl);
        return extractLyrics(data);
    } catch (e) {
        throw e;
    }
};