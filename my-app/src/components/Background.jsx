// Subtle decorative background (Spec 13/14 — isolated & removable:
// delete this file, its base.css @import, and the single App mount).
// Fixed to the viewport, behind content, non-interactive.
//
// Sparks random-walk node-to-node along the 32px grid within the left/
// right edge bands, each glowing and lifespan-bounded. A cursor glow
// follows the pointer (pointer devices only). Movement is written
// directly to element transforms via refs (no React re-render per step)
// using GPU-friendly transform/opacity; all timers/listeners/rAF are
// cleaned up on unmount; autonomous motion is disabled under reduced
// motion.

import { useEffect, useRef } from 'react';

// --- TWEAK POINTS -----------------------------------------------------
const NODE = 32;               // grid spacing (matches CSS background-size)
const SPARK_COUNT = 4;         // live sparks at once (perf vs liveliness)
const STEP_MS = 150;           // glide per node (lower = faster/electric)
const SPARK_LIFETIME_MS = 2000; // max spark life (~2s) before respawn
const STRAIGHT_BIAS = 0.72;    // chance of continuing straight (longer runs)
// Band width MUST mirror the CSS: clamp(140px, 22vw, 320px).
const BAND_MIN = 140;
const BAND_VW = 0.22;
const BAND_MAX = 320;
// Glow radius / tail length are CSS vars in background.css.
// ---------------------------------------------------------------------

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isPointerDevice = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const randInt = (n) => Math.floor(Math.random() * n);

function Background() {
    const sparkRefs = useRef([]);
    const cursorRef = useRef(null);

    // --- Walking sparks ---
    useEffect(() => {
        if (prefersReducedMotion()) {
            return undefined;
        }

        const bandWidth = () =>
            Math.max(
                NODE * 2,
                Math.min(
                    BAND_MAX,
                    Math.max(BAND_MIN, window.innerWidth * BAND_VW)
                )
            );

        let cols = Math.max(1, Math.floor(bandWidth() / NODE));
        let rows = Math.max(1, Math.floor(window.innerHeight / NODE));

        const onResize = () => {
            cols = Math.max(1, Math.floor(bandWidth() / NODE));
            rows = Math.max(1, Math.floor(window.innerHeight / NODE));
        };
        window.addEventListener('resize', onResize);

        // Tail angle (deg) so the streak points OPPOSITE the travel dir.
        // dir is [dc, dr]; the tail points back along -dir.
        const tailAngle = (dc, dr) => {
            if (dc === 1) return 180; // moving right -> tail points left
            if (dc === -1) return 0; // moving left  -> tail points right
            if (dr === 1) return 270; // moving down  -> tail points up
            if (dr === -1) return 90; // moving up    -> tail points down
            return 180;
        };

        // Per-spark mutable state.
        const sparks = sparkRefs.current.map((el, i) => ({
            el,
            band: i % 2 === 0 ? 'left' : 'right',
            col: 0,
            row: 0,
            dir: null, // [dc, dr] current travel direction
            bornAt: 0,
            timer: null
        }));

        const pixelX = (spark) => {
            if (spark.band === 'left') {
                return spark.col * NODE;
            }
            // right band measured inward from the right edge
            return window.innerWidth - spark.col * NODE;
        };

        const place = (spark) => {
            const x = pixelX(spark);
            const y = spark.row * NODE;
            spark.el.style.transform = `translate(${x}px, ${y}px)`;
        };

        const spawn = (spark) => {
            spark.col = randInt(cols + 1);
            spark.row = randInt(rows + 1);
            spark.dir = null;
            spark.bornAt = performance.now();

            // Appear STATIONARY: disable the transform transition so the
            // spark snaps to its spawn node (no fly-in), then fade in.
            spark.el.style.transition = 'opacity 400ms ease';
            place(spark);
            // Force reflow so the snapped position is committed before we
            // restore the transform transition.
            // eslint-disable-next-line no-unused-expressions
            spark.el.offsetWidth;
            window.requestAnimationFrame(() => {
                spark.el.classList.add('bg-flair__spark--active');
                // Let the fade-in settle at the node, THEN enable gliding
                // and start stepping.
                spark.timer = setTimeout(() => {
                    spark.el.style.transition = '';
                    step(spark);
                }, 260);
            });
        };

        // Pick the next direction: never reverse; bias toward straight.
        const chooseDir = (spark) => {
            const inBounds = ([dc, dr]) => {
                const c = spark.col + dc;
                const r = spark.row + dr;
                return c >= 0 && c <= cols && r >= 0 && r <= rows;
            };
            const all = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1]
            ];

            if (!spark.dir) {
                const valid = all.filter(inBounds);
                return valid[randInt(valid.length)] || null;
            }

            const [cdc, cdr] = spark.dir;
            const reverse = [-cdc, -cdr];
            // candidates: everything except the direct reverse, in bounds
            const candidates = all.filter(
                ([dc, dr]) =>
                    !(dc === reverse[0] && dr === reverse[1]) &&
                    inBounds([dc, dr])
            );
            if (candidates.length === 0) {
                return null;
            }
            // Prefer continuing straight if it's still valid.
            const straightValid = inBounds(spark.dir);
            if (straightValid && Math.random() < STRAIGHT_BIAS) {
                return spark.dir;
            }
            // Otherwise a (perpendicular) turn from the candidates.
            const turns = candidates.filter(
                ([dc, dr]) => !(dc === cdc && dr === cdr)
            );
            const pool = turns.length > 0 ? turns : candidates;
            return pool[randInt(pool.length)];
        };

        const step = (spark) => {
            // Time-based lifespan (~SPARK_LIFETIME_MS).
            if (performance.now() - spark.bornAt >= SPARK_LIFETIME_MS) {
                spark.el.classList.remove('bg-flair__spark--active');
                spark.timer = setTimeout(() => spawn(spark), 450);
                return;
            }

            const dir = chooseDir(spark);
            if (dir) {
                spark.dir = dir;
                spark.col += dir[0];
                spark.row += dir[1];
                spark.el.style.setProperty(
                    '--tail-angle',
                    `${tailAngle(dir[0], dir[1])}deg`
                );
                place(spark);
            }

            spark.timer = setTimeout(() => step(spark), STEP_MS);
        };

        sparks.forEach((spark, i) => {
            // Set the per-spark step duration for the CSS transition.
            spark.el.style.setProperty('--spark-step', `${STEP_MS}ms`);
            // Stagger starts slightly so they don't move in lockstep.
            spark.timer = setTimeout(
                () => spawn(spark),
                i * 250 + randInt(250)
            );
        });

        return () => {
            window.removeEventListener('resize', onResize);
            sparks.forEach((s) => s.timer && clearTimeout(s.timer));
        };
    }, []);

    // --- Cursor glow (pointer devices only) ---
    useEffect(() => {
        if (!isPointerDevice()) {
            return undefined;
        }
        const el = cursorRef.current;
        if (!el) {
            return undefined;
        }

        let x = 0;
        let y = 0;
        let raf = null;
        let revealed = false;

        const apply = () => {
            raf = null;
            el.style.transform = `translate(${x}px, ${y}px)`;
            if (!revealed) {
                revealed = true;
                el.classList.add('bg-flair__cursor--active');
            }
        };

        const onMove = (e) => {
            x = e.clientX;
            y = e.clientY;
            if (raf === null) {
                raf = window.requestAnimationFrame(apply);
            }
        };

        window.addEventListener('pointermove', onMove, { passive: true });

        return () => {
            window.removeEventListener('pointermove', onMove);
            if (raf !== null) {
                window.cancelAnimationFrame(raf);
            }
        };
    }, []);

    const sparks = Array.from({ length: SPARK_COUNT });

    return (
        <div className="bg-flair" aria-hidden="true">
            {sparks.map((_, i) => (
                <span
                    key={i}
                    className="bg-flair__spark"
                    ref={(el) => {
                        sparkRefs.current[i] = el;
                    }}
                >
                    <span className="bg-flair__spark-tail" />
                </span>
            ))}
            <span className="bg-flair__cursor" ref={cursorRef} />
        </div>
    );
}

export default Background;
