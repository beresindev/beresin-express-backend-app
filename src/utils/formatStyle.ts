// Capitalize the first letter of each word in a string
export const capitalize = (str: string): string => {
	return str
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

// Capitalize only the first letter of a string
export const capitalizeFirstWord = (str: string): string => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
};
