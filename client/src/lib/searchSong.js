import axios from 'axios';
import { checkOptions } from './utils/checkOptions.js';
import { getTitle } from './utils/getTitle.js';

const searchUrl = 'https://api.genius.com/search?q=';

/**
 * @param {{apiKey: string, title: string, artist: string, optimizeQuery: boolean, authHeader: boolean}} options
 */
export default async function (options) {
	try {
		checkOptions(options);
		let { apiKey, title, artist, optimizeQuery = false, authHeader = false } = options;
		const song = optimizeQuery ? getTitle(title, artist) : `${title} ${artist}`;
		const reqUrl = `${searchUrl}${encodeURIComponent(song)}`;
		const headers = {
			Authorization: 'Bearer ' + apiKey
		};
		const response = await axios.get(
			authHeader ? reqUrl : `${reqUrl}&access_token=${apiKey}`,
			authHeader && { headers }
		).then((data) => {
			console.log(data);
			if (data.data.response.hits.length === 0) return null;
			const results = data.data.response.hits.map((val) => {
				const { full_title, song_art_image_url, id, url } = val.result;
				return { id, title: full_title, albumArt: song_art_image_url, url };
			});
			console.log("HERE ARE THE RESULTS:", results);
			return results;
		});
		return response;
	} catch (e) {
		throw e;
	}
};
