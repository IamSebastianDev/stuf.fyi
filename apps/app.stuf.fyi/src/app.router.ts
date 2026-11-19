import { html } from '@grainular/nord';
import { $outlet, createRouter, navigate, pre } from '@grainular/router';
import { sessionStore } from './features/auth/session.store';
import { SignIn } from './features/auth/sign-in';
import { SignedIn } from './features/auth/signed-in';

const homePath = '/';
const signInPath = '/sign-in';
const sessionPath = () => (sessionStore.state.isAuthenticated() ? homePath : signInPath);
const supportsRouter = typeof window.navigation !== 'undefined' && 'URLPattern' in window;

const replaceRoute = (path: string) => {
    if (supportsRouter) navigate({ path, history: 'replace' });
    else window.location.replace(path);
};

const home = () => SignedIn({ onSignedOut: () => replaceRoute(signInPath) });
const signIn = () => SignIn({ onSignedIn: () => replaceRoute(homePath) });
const enforceSessionRoute = pre(({ path, redirect }) => {
    const destination = sessionPath();
    if (path !== destination) redirect(destination);
});

const router = supportsRouter
    ? createRouter('/', [
          { path: homePath, component: home, use: [enforceSessionRoute] },
          { path: signInPath, component: signIn, use: [enforceSessionRoute] },
          { path: '/*', component: () => html``, use: [enforceSessionRoute] },
      ])
    : null;

/** Opens the routes after the cookie session has been restored. */
export const AppRoutes = () => {
    if (router) return $outlet({ for: router });

    // Browsers without the Navigation API can still load and submit the passkey screen.
    const path = sessionPath();
    if (window.location.pathname !== path) {
        replaceRoute(path);
        return html``;
    }
    return path === homePath ? home() : signIn();
};
