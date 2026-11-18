import type { Preview } from '@storybook/html-vite';
import '@stuf/bits/theme.css';
import './preview.css';
import { ThemedDocs } from './themed-docs';

const preview: Preview = {
    parameters: {
        a11y: { test: 'error' },
        docs: {
            container: ThemedDocs,
        },
        options: {
            storySort: {
                order: [
                    'Design system',
                    ['Overview', 'Color primitives', 'Theme colors', 'Typography', 'Layout', 'Interaction'],
                ],
            },
        },
    },
    globalTypes: {
        theme: {
            description: 'Stuf color theme',
            toolbar: {
                title: 'Theme',
                icon: 'contrast',
                items: [
                    { value: 'system', title: 'System' },
                    { value: 'light', title: 'Light' },
                    { value: 'dark', title: 'Dark' },
                ],
                dynamicTitle: true,
            },
        },
    },
    initialGlobals: { theme: 'system' },
    decorators: [
        (story, { globals }) => {
            document.documentElement.dataset.theme = globals.theme;
            return story();
        },
    ],
};

export default preview;
