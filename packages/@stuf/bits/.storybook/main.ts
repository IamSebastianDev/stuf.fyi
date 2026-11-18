import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
    framework: '@storybook/html-vite',
    addons: ['@storybook/addon-docs'],
};

export default config;
