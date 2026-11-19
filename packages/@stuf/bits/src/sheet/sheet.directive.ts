import { grain } from '@grainular/grains';
import { createDirective } from '@grainular/nord';
import { resetSheetDrag } from './sheet-motion';

const dismissDistance = 72;
const tapTolerance = 8;
const dragOffset = '--stuf-sheet-drag-offset';

type Drag = {
    surface: Element;
    pointerId: number;
    startX: number;
    startY: number;
    canTap: boolean;
};

const withinTapDistance = (drag: Drag, event: PointerEvent) =>
    Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) <= tapTolerance;

/** Handles one drag at a time from the sheet's handle or backdrop. */
export const sheetDrag = (canDismiss: () => boolean) =>
    createDirective<HTMLDialogElement>((dialog) => {
        const drag = grain<Drag | null>(null);
        const backdropTap = grain(false);
        const controller = new AbortController();
        const options = { signal: controller.signal };

        const clearDrag = () => {
            drag.set(null);
            backdropTap.set(false);
            dialog.style.removeProperty(dragOffset);
        };

        const stopDrag = () => {
            const active = drag();
            clearDrag();
            if (active?.surface.hasPointerCapture(active.pointerId))
                active.surface.releasePointerCapture(active.pointerId);
        };

        const start = (event: PointerEvent) => {
            if (event.button !== 0 || drag()) return;

            backdropTap.set(false);
            const target = event.target as Element;
            if (!target.matches('[stuf-sheet-handle], [stuf-sheet-backdrop]') || !canDismiss()) return;

            target.setPointerCapture(event.pointerId);
            drag.set({
                surface: target,
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                canTap: target.hasAttribute('stuf-sheet-backdrop'),
            });
        };

        const move = (event: PointerEvent) => {
            const active = drag();
            if (active?.pointerId !== event.pointerId) return;

            if (active.canTap && !withinTapDistance(active, event)) drag.set({ ...active, canTap: false });
            dialog.style.setProperty(dragOffset, `${Math.max(0, event.clientY - active.startY)}px`);
        };

        const finish = (event: PointerEvent) => {
            const active = drag();
            if (active?.pointerId !== event.pointerId) return;

            const released = event.type === 'pointerup';
            const offset = dialog.style.getPropertyValue(dragOffset);
            if (released && event.clientY - active.startY >= dismissDistance) dialog.requestClose();
            clearDrag();

            if (parseFloat(offset) > 0 && dialog.open && !dialog.hasAttribute('stuf-sheet-closing'))
                resetSheetDrag(dialog, offset);

            // Keep the dialog open until the tap's click is dispatched.
            backdropTap.set(released && active.canTap && withinTapDistance(active, event));
        };

        const tapBackdrop = (event: MouseEvent) => {
            if (!backdropTap() || !(event.target as Element).hasAttribute('stuf-sheet-backdrop')) return;
            backdropTap.set(false);
            dialog.requestClose();
        };

        dialog.addEventListener('pointerdown', start, options);
        dialog.addEventListener('pointermove', move, options);
        dialog.addEventListener('pointerup', finish, options);
        dialog.addEventListener('pointercancel', finish, options);
        dialog.addEventListener('close', stopDrag, options);
        dialog.addEventListener('click', tapBackdrop, options);

        return () => {
            controller.abort();
            stopDrag();
        };
    });
