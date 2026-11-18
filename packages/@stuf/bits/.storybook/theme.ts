import type { Channel } from 'storybook/internal/channels';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';

type Appearance = 'light' | 'dark';
type ThemeEvent = {
    globals?: { theme?: unknown };
    userGlobals?: { theme?: unknown };
};

const darkScheme = '(prefers-color-scheme: dark)';
const readMode = (event: ThemeEvent | undefined) => event?.userGlobals?.theme ?? event?.globals?.theme;
const resolveAppearance = (mode: unknown, prefersDark: boolean): Appearance =>
    mode === 'light' || mode === 'dark' ? mode : prefersDark ? 'dark' : 'light';

const initialMode = (channel: Channel) =>
    readMode(channel.last(GLOBALS_UPDATED)?.[0]) ?? readMode(channel.last(SET_GLOBALS)?.[0]);

export const getStorybookAppearance = (channel: Channel): Appearance =>
    resolveAppearance(initialMode(channel), window.matchMedia(darkScheme).matches);

/** Subscribe to the shared toolbar selection and to system appearance changes. */
export const watchStorybookAppearance = (channel: Channel, apply: (appearance: Appearance) => void) => {
    const preference = window.matchMedia(darkScheme);
    let mode = initialMode(channel);
    const update = () => apply(resolveAppearance(mode, preference.matches));
    const updateMode = (event: ThemeEvent) => {
        mode = readMode(event);
        update();
    };

    channel.on(SET_GLOBALS, updateMode);
    channel.on(GLOBALS_UPDATED, updateMode);
    preference.addEventListener('change', update);
    update();

    return () => {
        channel.off(SET_GLOBALS, updateMode);
        channel.off(GLOBALS_UPDATED, updateMode);
        preference.removeEventListener('change', update);
    };
};
