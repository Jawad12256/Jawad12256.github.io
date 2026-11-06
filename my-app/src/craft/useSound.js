// Crafting Mode sound effects + persisted mute (Spec 12).
//
// Event-driven only (no autoplay). Mute persists in localStorage.
// Playback failures (autoplay policy, load errors, storage disabled)
// degrade silently so visuals always work.

import { useCallback, useState } from 'react';

import achievementGet from '../assets/craftingsfx/achievementget.mp3';
import clearClicked from '../assets/craftingsfx/clearclicked.mp3';
import masterCrafter from '../assets/craftingsfx/mastercrafter.mp3';
import notifIn from '../assets/craftingsfx/notificationin.ogg';
import notifOut from '../assets/craftingsfx/notificationout.ogg';

const SOURCES = {
    achievementGet,
    clearClicked,
    masterCrafter,
    notifIn,
    notifOut
};

const MUTE_KEY = 'craft:muted';

function readMuted() {
    try {
        return localStorage.getItem(MUTE_KEY) === '1';
    } catch (e) {
        return false;
    }
}

function writeMuted(muted) {
    try {
        localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch (e) {
        // ignore storage failures
    }
}

export function useSound() {
    const [muted, setMuted] = useState(readMuted);

    const play = useCallback(
        (name) => {
            if (muted) {
                return;
            }
            const src = SOURCES[name];
            if (!src) {
                return;
            }
            try {
                const audio = new Audio(src);
                audio.volume = 0.6;
                const p = audio.play();
                if (p && typeof p.catch === 'function') {
                    p.catch(() => {
                        /* autoplay blocked / load error — ignore */
                    });
                }
            } catch (e) {
                /* Audio unsupported — ignore */
            }
        },
        [muted]
    );

    const toggleMute = useCallback(() => {
        setMuted((m) => {
            const next = !m;
            writeMuted(next);
            return next;
        });
    }, []);

    return { play, muted, toggleMute };
}
