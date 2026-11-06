// One-time scroll reveal via IntersectionObserver. Returns a ref to
// attach to the element and a boolean that flips true (and stays true)
// once the element first scrolls into view. Graceful fallbacks: if
// IntersectionObserver is unavailable, content is shown immediately, so
// sections are never left stuck hidden.

import { useEffect, useRef, useState } from 'react';

export function useReveal() {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        if (shown) {
            return undefined;
        }
        const el = ref.current;
        if (!el) {
            return undefined;
        }
        if (
            typeof window === 'undefined' ||
            !('IntersectionObserver' in window)
        ) {
            setShown(true); // fallback: always visible
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0] && entries[0].isIntersecting) {
                    setShown(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [shown]);

    return [ref, shown];
}
