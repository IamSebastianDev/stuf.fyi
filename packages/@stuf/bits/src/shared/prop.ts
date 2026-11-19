import type { Subscribable } from '@grainular/nord';

export type Prop<T> = T | Subscribable<T>;
export const unwrap = <T>(prop: Prop<T>): T => {
    return typeof prop === 'function' && 'subscribe' in prop ? prop() : prop;
};
