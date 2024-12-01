export const capitalize = (str: string): string => {
	return str
		.split(' ')
		.map((word) => {
			if (/[A-Z]/.test(word) && /[a-z]/.test(word) === false) {
				return word;
			}
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join(' ');
};

export const capitalizeFirstWord = (str: string): string => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
};
