import { derived } from '@grainular/grains';
import { $switch, html, on } from '@grainular/nord';
import { Button } from '@stuf/bits/button';
import { pingPong } from './core/services/socket-client';
import { healthStore } from './features/health/health.store';

export const App = () => {
    const { state, data, error, refresh } = healthStore.state;
    const { data: socketData, ...channel } = pingPong;
    socketData.subscribe(console.log);

    return html`
        ${$switch(state)
            .$case('idle', () => html`${derived(data, JSON.stringify)}`)
            .$case('error', () => html`Error: ${derived(error, (error) => error?.message)}`)
            .$default(() => html`Loading...`)}
        <button
            type="button"
            ${Button()}
            ${on('click', () => {
                refresh();
                channel.send({ message: 'Test' });
            })}
        >
            Refresh
        </button>
    `;
};
