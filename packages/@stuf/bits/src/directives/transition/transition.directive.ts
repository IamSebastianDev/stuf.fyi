import { grain } from '@grainular/grains';
import { createDirective } from '@grainular/nord';

export { fade, slideY } from './transition-recipes';

export type TransitionDirection = 'in' | 'out';

type TransitionContext = {
    direction: TransitionDirection;
    // True when the previous run animated this element.
    interrupted: boolean;
};

/** Describes the keyframes and timing for one element in a transition. */
export type TransitionRecipe<Options> = (
    element: HTMLElement,
    options: Options,
    context: TransitionContext,
) => {
    keyframes: Keyframe[] | PropertyIndexedKeyframes;
    timing?: KeyframeAnimationOptions;
};

type Registration = {
    element: HTMLElement;
    // When omitted, the recipe runs for both intro and outro.
    direction?: TransitionDirection;
    recipe: (context: TransitionContext) => ReturnType<TransitionRecipe<unknown>>;
};

// Canceling releases any styles held by fill. Clearing also drops references to completed animations.
const cancelAnimations = (animations: Map<Registration, Animation>) => {
    animations.forEach((animation) => animation.cancel());
    animations.clear();
};

/** Registers element recipes and plays them together when the caller triggers a direction. */
export const createTransition = () => {
    // The registry lives for the group. Each trigger call gets a fresh map of animations.
    const registrations = new Set<Registration>();
    const active = grain(new Map<Registration, Animation>());

    const register =
        (direction?: TransitionDirection) =>
        <Options>(recipe: TransitionRecipe<Options>, options: NoInfer<Options>) =>
            createDirective<HTMLElement>((element) => {
                // Capture the element and its options now. Resolve keyframes from live styles when playback starts.
                const entry: Registration = {
                    element,
                    direction,
                    recipe: (context) => recipe(element, options, context),
                };
                registrations.add(entry);

                // Unmounting removes the recipe from future runs and stops this element's current animation.
                return () => {
                    registrations.delete(entry);
                    active().get(entry)?.cancel();
                };
            });

    const play = async (direction: TransitionDirection): Promise<boolean> => {
        const previous = active();
        // Match by element so separate intro and outro registrations can pick up from each other.
        const interruptedElements = new Set(Array.from(previous.keys(), ({ element }) => element));
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // An empty run still replaces any playback that started before reduced motion was enabled.
        const entries = reducedMotion ? [] : [...registrations];

        // Plan every animation before changing styles. An interrupted recipe can read its current
        // on-screen values while the previous animation still applies.
        const plans = entries
            .filter((entry) => entry.direction === undefined || entry.direction === direction)
            .map((entry) => ({
                entry,
                ...entry.recipe({ direction, interrupted: interruptedElements.has(entry.element) }),
            }));

        const animations = new Map<Registration, Animation>();
        // Publish the new run before cancellation settles the previous run's promises.
        active.set(animations);
        cancelAnimations(previous);

        try {
            for (const { entry, keyframes, timing } of plans) {
                const animation = entry.element.animate(keyframes, {
                    duration: 220,
                    easing: 'ease',
                    ...timing,
                    // Hold the first frame during delays and the last frame until the whole group settles.
                    fill: 'both',
                });
                animations.set(entry, animation);
            }

            // Animation.finished rejects when replacement playback or teardown cancels it.
            await Promise.allSettled([...animations.values()].map(({ finished }) => finished));
            // Only the latest trigger can tell its caller to commit a visibility change.
            return active() === animations;
        } finally {
            // Clean up this run only, including animations started before a later animate() call threw.
            cancelAnimations(animations);
        }
    };

    return {
        transition: Object.assign(register(), { in: register('in'), out: register('out') }),
        trigger: {
            in: () => play('in'),
            out: () => play('out'),
        },
    };
};
