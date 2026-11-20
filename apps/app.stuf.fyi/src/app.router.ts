import { createRouter, pre } from '@grainular/router';
import { requireGuest, requireSession } from './core/guards/session.guards';

const settingsPage = () => import('./features/settings/pages/settings.page');

export const router = createRouter('/', [
    {
        path: '/',
        component: settingsPage,
        use: [requireSession, pre(({ redirect }) => redirect('/settings'))],
    },
    {
        path: '/settings',
        component: settingsPage,
        use: [requireSession],
    },
    {
        path: '/sign-in',
        component: () => import('./features/auth/pages/sign-in.page'),
        use: [requireGuest],
    },
    {
        path: '/sign-up',
        component: () => import('./features/auth/pages/sign-up.page'),
        use: [requireGuest],
    },
    {
        path: '/sign-up/verify',
        component: () => import('./features/auth/pages/verify-email.page'),
        use: [requireGuest],
    },
]);
