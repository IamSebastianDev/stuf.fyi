import { createRouter } from '@grainular/router';
import { requireGuest, requireSession } from './core/guards/session.guards';

export const router = createRouter('/', [
    {
        path: '/',
        component: () => import('./pages/home.page'),
        use: [requireSession],
    },
    {
        path: '/sign-in',
        component: () => import('./features/auth/pages/sign-in.page'),
        use: [requireGuest],
    },
]);
