import type { TransitionRecipe } from './transition.directive';

type Timing = Pick<KeyframeAnimationOptions, 'duration' | 'delay' | 'easing'>;

/** Fades between transparent and the given resting opacity. */
export const fade: TransitionRecipe<Timing & { opacity?: number }> = (
    element,
    { opacity = 1, ...timing },
    { direction, interrupted },
) => ({
    keyframes: {
        opacity: [
            direction === 'in' && !interrupted ? '0' : getComputedStyle(element).opacity,
            direction === 'in' ? String(opacity) : '0',
        ],
    },
    timing,
});

/** Slides vertically between the given distance and the resting position. */
export const slideY: TransitionRecipe<Timing & { distance: string }> = (
    element,
    { distance, ...timing },
    { direction, interrupted },
) => {
    const offset = `translateY(${distance})`;
    return {
        keyframes: {
            transform: [
                direction === 'in' && !interrupted ? offset : getComputedStyle(element).transform,
                direction === 'in' ? 'translateY(0)' : offset,
            ],
        },
        timing,
    };
};
