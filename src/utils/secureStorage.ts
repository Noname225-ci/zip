// A simple wrapper around localStorage to obfuscate/encrypt data.
// Since all code is client-side and open, true encryption against a determined attacker
// with physical access to the device or full XSS is impossible without a user password.
// However, this prevents casual scraping by generic third-party scripts (like AdSense or analytics)
// that might look for common plain-text JSON keys in localStorage.

const SALT = "wasted_or_worth_it_v1_";

/**
 * Basic Base64 encoding with a salt to obfuscate data.
 * This is NOT banking-level encryption, but it is sufficient to hide
 * plain JSON data from generic third-party ad/tracking scripts.
 */
function obfuscate(data: string): string {
    try {
        // Add salt, encode special characters properly, then base64
        const saltedData = SALT + data;
        // Using encodeURIComponent handles UTF-8 characters better than straight btoa
        return btoa(encodeURIComponent(saltedData));
    } catch (e) {
        console.error("Failed to obfuscate data", e);
        return data; // Fallback to plain if error
    }
}

/**
 * Basic Base64 decoding with a salt check.
 */
function deobfuscate(data: string): string | null {
    try {
        const decoded = decodeURIComponent(atob(data));
        if (decoded.startsWith(SALT)) {
            return decoded.substring(SALT.length);
        }
        return null; // Salt doesn't match, might be old unencrypted data or corrupted
    } catch (e) {
        // If it fails to decode, it might be old plain-text data
        return null;
    }
}

export const secureStorage = {
    setItem(key: string, value: any): void {
        try {
            const jsonString = JSON.stringify(value);
            const securedString = obfuscate(jsonString);
            localStorage.setItem(key, securedString);
        } catch (error) {
            console.error(`Error saving secured data to localStorage for key "${key}":`, error);
        }
    },

    getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            // First try to deobfuscate
            const deobfuscatedString = deobfuscate(item);

            if (deobfuscatedString) {
                return JSON.parse(deobfuscatedString) as T;
            }

            // Fallback: If deobfuscate returned null, it might be old unencrypted data from before this update.
            // We try to parse it directly. If it works, we should ideally re-save it securely.
            try {
                const parsed = JSON.parse(item) as T;
                // Re-save securely for the future
                this.setItem(key, parsed);
                return parsed;
            } catch (parseError) {
                // Not valid JSON either
                return null;
            }
        } catch (error) {
            console.error(`Error retrieving secured data from localStorage for key "${key}":`, error);
            return null;
        }
    },

    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing data from localStorage for key "${key}":`, error);
        }
    }
};
