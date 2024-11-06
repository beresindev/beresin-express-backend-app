// utils/tokenBlacklist.ts

const blacklist = new Set<string>();

export const addTokenToBlacklist = (token: string) => {
    blacklist.add(token);
};

export const isTokenBlacklisted = (token: string): boolean => {
    return blacklist.has(token);
};
