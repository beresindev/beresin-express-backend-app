// Capitalize the first letter of each word in a string
export const capitalize = (str: string): string => {
	return str
		.split(' ')
		.map((word) => {
			// Preserve casing for words with special formats
			if (/[A-Z]/.test(word) && /[a-z]/.test(word) === false) {
				return word;
			}
			// Capitalize the first letter of other words
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join(' ');
};

// Capitalize only the first letter of a string
export const capitalizeFirstWord = (str: string): string => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
};
