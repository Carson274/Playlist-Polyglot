export const checkOptions = (options) => {
	let { apiKey, title, artist } = options;
	if (!apiKey) {
		throw '"apiKey" property is missing from options';
	} else if (!title) {
		throw '"title" property is missing from options';
	} else if (!artist) {
		throw '"artist" property is missing from options';
	}
};