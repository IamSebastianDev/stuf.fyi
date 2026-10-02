import { derived } from '@grainular/grains';
import { $switch, html, on } from '@grainular/nord';
import { healthStore } from './features/health/health.store';

export const App = () => {
    const { state, data, error, refresh } = healthStore.state;

    return html`
        ${$switch(state)
            .$case('idle', () => html`${derived(data, JSON.stringify)}`)
            .$case('error', () => html`Error: ${derived(error, (error) => error?.message)}`)
            .$default(() => html`Loading...`)}
        <button ${on('click', () => refresh())}>Refresh</button>
    `;
};
