import { control, form, required, type Control } from '@grainular/forms';
import { grain } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { Checkbox } from '@stuf/bits/checkbox';
import { TextField } from '@stuf/bits/text-field';
import { expect } from 'storybook/test';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { Button } from '../button/button';
import { Text } from '../text/text';
import { ControlContainer, type ControlContainerProps } from './control-container';

type ControlContainerArgs = {
    label: string;
    description?: string;
    showError: boolean;
    layout?: ControlContainerProps<boolean>['layout'];
};

const description = 'This name appears in the meal plan.';
const placeholder = 'e.g. Chickpea bowls';

const exampleImports = [
    "import { form, required } from '@grainular/forms';",
    "import { ControlContainer } from '@stuf/bits/control-container';",
    "import { TextField } from '@stuf/bits/text-field';",
];

const formSource = [
    "const meal = form({ name: '' }, ({ name }) => {",
    "    required(name, { message: 'Enter a meal name.' });",
    '});',
];

const templateSetup = [...exampleImports, "import { html } from '@grainular/nord';", '', ...formSource, ''];

const fieldSource = [
    'ControlContainer({',
    '    control: meal.controls.name,',
    "    name: 'name',",
    "    label: 'Meal name',",
    `    description: '${description}',`,
    `    children: (props) => TextField({ ...props, placeholder: '${placeholder}', required: true }),`,
    '})',
];

const templateSource = [
    'html`',
    '    <section aria-label="Meal details">',
    `        \${${fieldSource.join('\n        ')}}`,
    '    </section>',
    '`;',
];

const createMealForm = () => form({ name: '' }, ({ name }) => required(name, { message: 'Enter a meal name.' }));

const mealName = (control: Control<string>, label: string, description?: string) =>
    ControlContainer({
        control,
        label,
        name: 'name',
        description,
        children: (props) => TextField({ ...props, placeholder, required: true }),
    });

const exampleField = ({ label, description, showError }: ControlContainerArgs) => {
    const meal = createMealForm();
    if (showError) meal.validate();

    return mealName(meal.controls.name, label, description);
};

export default {
    title: 'Components/Control Container',
    parameters: {
        layout: 'centered',
        docs: { codePanel: true, source: { language: 'typescript', type: 'code' } },
    },
    args: { label: 'Meal name', description, showError: false },
    argTypes: {
        label: { control: 'text', description: 'Visible field label.' },
        description: { control: 'text', description: 'Optional help associated with the control.' },
        showError: { control: 'boolean', description: 'Validates the example when the story opens.' },
    },
    render: (args) => renderNordStory(() => html`<section aria-label="Meal details">${exampleField(args)}</section>`),
} satisfies Meta<ControlContainerArgs>;

type Story = StoryObj<ControlContainerArgs>;

export const Playground = {
    parameters: {
        docs: {
            source: {
                code: [...templateSetup, ...templateSource].join('\n'),
            },
        },
    },
} satisfies Story;

export const Variants = {
    parameters: {
        controls: { disable: true },
        layout: 'padded',
        docs: {
            source: {
                code: [...templateSetup, 'meal.validate();', '', ...templateSource].join('\n'),
            },
        },
    },
    render: (args) =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Label only</figcaption>
                        ${exampleField({ ...args, description: undefined })}
                    </figure>
                    <figure>
                        <figcaption>With help text</figcaption>
                        ${exampleField(args)}
                    </figure>
                    <figure>
                        <figcaption>With a validation error</figcaption>
                        ${exampleField({ ...args, showError: true })}
                    </figure>
                </div>
            `,
        ),
    play: async ({ canvas }) => {
        const [labelOnly, withHelp, withError] = canvas.getAllByRole('textbox', { name: 'Meal name' });
        await expect(labelOnly).not.toHaveAttribute('aria-describedby');
        await expect(withHelp).toHaveAccessibleDescription(description);
        await expect(withError).toHaveAccessibleDescription(`${description} Enter a meal name.`);
    },
} satisfies Story;

export const InlineRow = {
    args: { label: 'Supermarket', layout: 'label-start' },
    argTypes: {
        layout: {
            control: 'select',
            options: ['label-start', 'label-end'],
            description: 'Places the label before or after the field.',
        },
    },
    parameters: {
        controls: { include: ['label', 'layout'] },
        layout: 'padded',
        docs: { codePanel: false },
    },
    render: ({ label, layout }) =>
        renderNordStory(
            () => html`
                <div class="stuf-form-story-example">
                    ${ControlContainer({
                        label,
                        layout,
                        control: control(true),
                        children: (props) => Checkbox({ ...props, appearance: 'checkmark' }),
                    })}
                </div>
            `,
        ),
} satisfies Story;

export const FormExample = {
    name: 'Form',
    parameters: {
        controls: { disable: true },
        layout: 'padded',
        docs: {
            source: {
                code: [
                    ...exampleImports,
                    "import { html, on } from '@grainular/nord';",
                    "import { Button } from '@stuf/bits/button';",
                    '',
                    'export const MealForm = (saveMeal: (value: { name: string }) => void) => {',
                    ...formSource.map((line) => `    ${line}`),
                    '',
                    '    return html`',
                    '        <form',
                    '            novalidate',
                    "            ${on('submit', (event) => {",
                    '                event.preventDefault();',
                    '                if (meal.validate()) saveMeal(meal.value());',
                    '            })}',
                    '        >',
                    `            \${${fieldSource.join('\n            ')}}`,
                    '            <button type="submit" ${Button({ appearance: \'primary\' })}>Save meal</button>',
                    '        </form>',
                    '    `;',
                    '};',
                ].join('\n'),
            },
        },
    },
    render: () =>
        renderNordStory(() => {
            const meal = createMealForm();
            const result = grain('');

            return html`
                <form
                    class="stuf-form-story-example"
                    novalidate
                    ${on('submit', (event) => {
                        event.preventDefault();
                        result.set('');
                        if (meal.validate()) result.set(`Saved ${meal.value().name}`);
                    })}
                >
                    ${mealName(meal.controls.name, 'Meal name', description)}
                    <div><button type="submit" ${Button({ appearance: 'primary' })}>Save meal</button></div>
                    <p ${Text({ size: 'caption' })} role="status">${result}</p>
                </form>
            `;
        }),
    play: async ({ canvas, userEvent }) => {
        const field = canvas.getByRole('textbox', { name: 'Meal name' });
        const save = canvas.getByRole('button', { name: 'Save meal' });

        await expect(field).toBeRequired();
        await expect(field).toHaveAttribute('name', 'name');
        await expect(field).toHaveAccessibleDescription(description);
        await userEvent.click(save);
        await expect(field).toHaveAttribute('aria-invalid', 'true');
        await expect(field).toHaveAccessibleDescription(`${description} Enter a meal name.`);

        await userEvent.type(field, 'Chickpea bowls');
        await expect(field).toHaveAttribute('aria-invalid', 'false');
        await expect(field).toHaveAccessibleDescription(description);
        await userEvent.click(save);
        await expect(canvas.getByRole('status')).toHaveTextContent('Saved Chickpea bowls');
    },
} satisfies Story;
