import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import { watchStorybookAppearance } from './theme';

addons.register('stuf/appearance', () => {
    watchStorybookAppearance(addons.getChannel(), (appearance) => {
        addons.setConfig({ theme: themes[appearance] });
    });
});
