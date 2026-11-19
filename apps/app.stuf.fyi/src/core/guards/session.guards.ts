import { pre } from '@grainular/router';
import { sessionStore } from '../../features/auth/stores/session.store';

export const requireSession = pre(({ redirect }) => {
    if (!sessionStore.state.isAuthenticated()) redirect('/sign-in');
});

export const requireGuest = pre(({ redirect }) => {
    if (sessionStore.state.isAuthenticated()) redirect('/');
});
