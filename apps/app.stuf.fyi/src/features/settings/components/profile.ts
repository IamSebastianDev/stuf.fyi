import type { Control } from '@grainular/forms';
import { $if, attr, html, on, type Subscribable } from '@grainular/nord';
import { Button } from '@stuf/bits/button';
import { ColorPicker, type ColorPickerOption } from '@stuf/bits/color-picker';
import { ControlContainer } from '@stuf/bits/control-container';
import { Surface } from '@stuf/bits/surface';
import { Text } from '@stuf/bits/text';
import { TextField } from '@stuf/bits/text-field';
import { ProfileColorSchema, type ProfileColor } from '@stuf/contracts/user';
import './profile.css';

const profileColorSwatches = {
    MINT: { label: 'Mint', color: 'mint' },
    BLUE: { label: 'Blue', color: 'blue' },
    AMBER: { label: 'Amber', color: 'amber' },
    CORAL: { label: 'Coral', color: 'coral' },
    VIOLET: { label: 'Violet', color: 'violet' },
} satisfies Record<ProfileColor, Omit<ColorPickerOption<ProfileColor>, 'value'>>;

const profileColorOptions = ProfileColorSchema.options.map((value) => ({
    value,
    ...profileColorSwatches[value],
}));

type ProfileProps = {
    displayName: Control<string>;
    profileColor: Control<ProfileColor>;
    saving: Subscribable<boolean>;
    failed: Subscribable<boolean>;
    save: () => void;
};

const ProfileNameField = (control: Control<string>) => html`
    <div class="settings-profile-row" ${Surface()}>
        ${ControlContainer({
            control,
            label: 'Name',
            layout: 'label-start',
            name: 'displayName',
            children: (props) =>
                TextField({
                    ...props,
                    appearance: 'plain',
                    align: 'end',
                    placeholder: 'Optional',
                    autocapitalize: 'words',
                }),
        })}
    </div>
`;

const ProfileColorField = (control: Control<ProfileColor>) => html`
    <div class="settings-profile-row settings-profile-color" ${Surface()}>
        <span ${Text({ appearance: 'muted' })}>Color</span>
        ${ColorPicker({ control, label: 'Profile color', options: profileColorOptions })}
    </div>
`;

/** Renders the profile draft and saves when an edit is committed. */
export const Profile = ({ displayName, profileColor, saving, failed, save }: ProfileProps) => {
    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        save();
    };

    return html`
        <section aria-labelledby="settings-profile">
            <h2 id="settings-profile" ${Text({ size: 'section-label', appearance: 'muted' })}>Profile</h2>
            <form
                class="settings-profile"
                ${attr({ 'aria-busy': saving })}
                ${on('change', save)}
                ${on('submit', handleSubmit)}
            >
                ${ProfileNameField(displayName)} ${ProfileColorField(profileColor)}
                ${$if(failed).$then(
                    () => html`
                        <div class="settings-profile-error">
                            <p ${Text({ size: 'caption' })} role="alert">Couldn’t save your profile.</p>
                            <button type="button" ${Button({ appearance: 'plain', size: 'sm' })} ${on('click', save)}>
                                Try again
                            </button>
                        </div>
                    `,
                )}
            </form>
            <p class="settings-profile-help" ${Text({ size: 'caption', appearance: 'muted' })}>
                Your default name and color for shared lists.
            </p>
        </section>
    `;
};
