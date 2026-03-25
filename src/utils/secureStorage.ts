// A simple wrapper around localStorage to obfuscate/encrypt data.
// Since all code is client-side and open, true encryption against a determined attacker
// with physical access to the device or full XSS is impossible without a user password.
// However, this prevents casual scraping by generic third-party scripts (like AdSense or analytics)
// that might look for common plain-text JSON keys in localStorage.

const SALT = "wasted_or_worth_it_v1_";

// Hard cap: refuse to write more than 500 KB to any single key
const MAX_STORAGE_BYTES = 500_000;

function obfuscate(data: string): string {
    try {
        const saltedData = SALT + data;
        return btoa(encodeURIComponent(saltedData));
    } catch (e) {
        console.error("Failed to obfuscate data", e);
        return data;
    }
}

function deobfuscate(data: string): string | null {
    try {
        const decoded = decodeURIComponent(atob(data));
        if (decoded.startsWith(SALT)) {
            return decoded.substring(SALT.length);
        }
        return null;
    } catch (_e) {
        return null;
    }
}

export const secureStorage = {
    setItem(key: string, value: unknown): void {
        try {
            const jsonString = JSON.stringify(value);
            // Guard: refuse to write oversized payloads that could exhaust storage quota
            if (jsonString.length > MAX_STORAGE_BYTES) {
                console.warn(`secureStorage: refusing oversized write for key "${key}" (${jsonString.length} bytes)`);
                return;
            }
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

            const deobfuscatedString = deobfuscate(item);

            if (deobfuscatedString) {
                return JSON.parse(deobfuscatedString) as T;
            }

            // Fallback: old unencrypted data — parse and re-save securely
            try {
                const parsed = JSON.parse(item) as T;
                this.setItem(key, parsed);
                return parsed;
            } catch {
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
