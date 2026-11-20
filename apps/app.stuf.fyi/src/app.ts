import { combined, derived } from '@grainular/grains';
import { $if, html } from '@grainular/nord';
import { $outlet } from '@grainular/router';
import { BottomNav, type BottomNavItem } from '@stuf/bits/bottom-nav';
import { Circle, CircleDot, Menu, Square } from 'lucide';
import { router } from './app.router';
import { SessionGate } from './features/auth/session-gate';
import { sessionStore } from './features/auth/stores/session.store';

const destinations: readonly BottomNavItem[] = [
    { label: 'Plan', icon: Square },
    { label: 'Meals', icon: Circle },
    { label: 'List', icon: Menu },
    { href: '/settings', label: 'Settings', icon: CircleDot },
];
const currentPath = derived(router.state, ({ route }) => route?.path ?? null);
const showNavigation = derived(
    combined([sessionStore.state.isAuthenticated, currentPath]),
    ([authenticated, path]) => authenticated && destinations.some(({ href }) => href === path),
);

export const App = () =>
    SessionGate(
        () => html`
            <div class="app-shell">
                <div class="app-shell-content">${$outlet({ for: router })}</div>
                ${$if(showNavigation).$then(() => BottomNav({ items: destinations, currentPath }))}
            </div>
        `,
    );
