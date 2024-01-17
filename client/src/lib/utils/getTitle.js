export const getTitle = (title, artist) => {
	return `${title} ${artist}`
		.toLowerCase()
		.replace(/ *\([^)]*\) */g, '')
		.replace(/ *\[[^\]]*]/, '')
		.replace(/feat.|ft./g, '')
		.replace(/\s+/g, ' ')
		.trim();
};