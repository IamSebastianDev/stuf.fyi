import { $outlet } from '@grainular/router';
import { router } from './app.router';
import { SessionGate } from './features/auth/components/session-gate';

export const App = () => SessionGate(() => $outlet({ for: router }));
