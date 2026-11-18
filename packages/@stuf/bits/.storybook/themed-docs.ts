import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { createElement, useEffect, useLayoutEffect, useState, type PropsWithChildren } from 'react';
import { themes } from 'storybook/theming';
import { getStorybookAppearance, watchStorybookAppearance } from './theme';

/** Give Storybook Docs and the Stuf tokens in its iframe the same appearance. */
export const ThemedDocs = (props: PropsWithChildren<DocsContainerProps>) => {
    const { channel } = props.context;
    const [appearance, setAppearance] = useState(() => getStorybookAppearance(channel));

    useEffect(() => watchStorybookAppearance(channel, setAppearance), [channel]);
    useLayoutEffect(() => {
        document.documentElement.dataset.theme = appearance;
    }, [appearance]);

    return createElement(DocsContainer, { ...props, theme: themes[appearance] });
};
