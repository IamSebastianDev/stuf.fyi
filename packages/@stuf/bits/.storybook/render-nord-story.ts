import { mount, type ComponentFragment } from '@grainular/nord';

const hostTag = 'stuf-nord-story';

/** Mounts Nord when Storybook attaches the story and disposes it when that canvas replaces the host. */
export const renderNordStory = (render: () => ComponentFragment): HTMLElement => {
    if (!customElements.get(hostTag)) {
        customElements.define(
            hostTag,
            class extends HTMLElement {
                renderNord?: () => ComponentFragment;
                #disconnect?: () => void;

                connectedCallback() {
                    if (this.renderNord) {
                        this.#disconnect = mount(this.renderNord, { to: this });
                    }
                }

                disconnectedCallback() {
                    const disconnect = this.#disconnect;
                    this.#disconnect = undefined;
                    this.replaceChildren();
                    // Give Nord's observer a chance to clean up the removed nodes first.
                    if (disconnect) queueMicrotask(disconnect);
                }
            },
        );
    }

    const host = document.createElement(hostTag) as HTMLElement & { renderNord: () => ComponentFragment };
    host.renderNord = render;
    return host;
};
