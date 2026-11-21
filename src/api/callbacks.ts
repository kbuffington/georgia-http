export const noop = () => {};

/**
 * keydown handler for custom (role="button") controls: runs `action` on Enter or Space,
 * the keys that activate a native button.
 */
export const onActivateKey = (action: () => void) => (evt: KeyboardEvent) => {
    if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault(); // keep Space from scrolling the page
        action();
    }
};
