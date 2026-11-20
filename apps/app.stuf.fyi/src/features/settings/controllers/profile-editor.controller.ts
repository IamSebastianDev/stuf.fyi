import { form } from '@grainular/forms';
import { derived } from '@grainular/grains';
import type { UserResponse } from '@stuf/contracts/user';
import { settingsStore } from '../stores/settings.store';

/** Creates the profile draft for one visit to Settings. */
export const createProfileEditor = (user: UserResponse | null) => {
    const draft = form({ displayName: user?.displayName ?? '', profileColor: user?.profileColor ?? 'BLUE' });
    const { profileSaveStatus } = settingsStore.state;

    const save = () => {
        if (!user) return;

        const { displayName, profileColor } = draft.value();
        const name = displayName.trim();
        draft.controls.displayName.value.set(name);
        settingsStore.actions.saveProfile(user.id, { displayName: name || null, profileColor });
    };

    return {
        ...draft.controls,
        saving: derived(profileSaveStatus, (status) => status === 'pending'),
        failed: derived(profileSaveStatus, (status) => status === 'error'),
        save,
    };
};
