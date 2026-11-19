const preferenceKey = 'stuf.passkey-used';

/** Returns whether a passkey session has been established in this browser. */
export const hasUsedPasskey = (): boolean => {
    try {
        return localStorage.getItem(preferenceKey) === 'true';
    } catch {
        return false;
    }
};

/** Remembers the preferred action when browser storage is available. */
export const rememberPasskeyUse = (): void => {
    try {
        localStorage.setItem(preferenceKey, 'true');
    } catch {
        // The preference is optional. The session still works when storage is unavailable.
    }
};
