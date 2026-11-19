export const sheetDuration = 220;

const sheetPanel = (dialog: HTMLDialogElement) => dialog.querySelector<HTMLElement>('[stuf-sheet-content]')!;

/** Returns the panel to its resting position after a short or canceled drag. */
export const resetSheetDrag = (dialog: HTMLDialogElement, offset: string) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    sheetPanel(dialog).animate(
        { transform: [`translateY(${offset})`, 'translateY(0)'] },
        { duration: sheetDuration, easing: 'ease', fill: 'backwards' },
    );
};
