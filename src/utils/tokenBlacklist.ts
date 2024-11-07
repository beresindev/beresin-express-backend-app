const tokenBlacklist = new Set<string>();

export const addToBlacklist = (token: string) => {
	tokenBlacklist.add(token);

	// Hapus token dari blacklist setelah 15 menit (waktu kadaluarsa token)
	setTimeout(
		() => {
			tokenBlacklist.delete(token);
		},
		15 * 60 * 1000,
	); // 15 menit dalam milidetik
};

export const isTokenBlacklisted = (token: string): boolean => {
	return tokenBlacklist.has(token);
};
