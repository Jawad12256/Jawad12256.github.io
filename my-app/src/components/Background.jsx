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
const NODE = 32;              // grid spacing (matches CSS background-size)
const SPARK_COUNT = 4;        // live sparks at once (perf vs. liveliness)
const SPARK_MAX_NODES = 15;   // lifespan: nodes travelled before retiring
const STEP_MS = 900;          // glide duration between adjacent nodes
// Glow radius is the CSS var --spark-glow-radius in background.css.
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
                Math.min(200, Math.max(90, window.innerWidth * 0.14))
            );

        let cols = Math.max(1, Math.floor(bandWidth() / NODE));
        let rows = Math.max(1, Math.floor(window.innerHeight / NODE));

        const onResize = () => {
            cols = Math.max(1, Math.floor(bandWidth() / NODE));
            rows = Math.max(1, Math.floor(window.innerHeight / NODE));
        };
        window.addEventListener('resize', onResize);

        // Per-spark mutable state.
        const sparks = sparkRefs.current.map((el, i) => ({
            el,
            band: i % 2 === 0 ? 'left' : 'right',
            col: 0,
            row: 0,
            nodes: 0,
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
            spark.nodes = 0;
            // Jump (no glide) to the spawn point, then fade in.
            spark.el.style.transition = 'opacity 600ms ease';
            place(spark);
            // next frame: restore glide transition + activate
            window.requestAnimationFrame(() => {
                spark.el.style.transition = '';
                spark.el.classList.add('bg-flair__spark--active');
            });
        };

        const step = (spark) => {
            if (spark.nodes >= SPARK_MAX_NODES) {
                // Retire: fade out, then respawn elsewhere.
                spark.el.classList.remove('bg-flair__spark--active');
                spark.timer = setTimeout(() => {
                    spawn(spark);
                    spark.timer = setTimeout(() => step(spark), STEP_MS);
                }, 650);
                return;
            }

            // Choose a random valid cardinal direction within bounds.
            const moves = [];
            if (spark.col > 0) moves.push([-1, 0]);
            if (spark.col < cols) moves.push([1, 0]);
            if (spark.row > 0) moves.push([0, -1]);
            if (spark.row < rows) moves.push([0, 1]);
            if (moves.length > 0) {
                const [dc, dr] = moves[randInt(moves.length)];
                spark.col += dc;
                spark.row += dr;
            }
            spark.nodes += 1;
            place(spark);

            spark.timer = setTimeout(() => step(spark), STEP_MS);
        };

        sparks.forEach((spark, i) => {
            // Stagger starts a little so they don't move in lockstep.
            spark.timer = setTimeout(() => {
                spawn(spark);
                spark.timer = setTimeout(() => step(spark), STEP_MS);
            }, i * 400 + randInt(400));
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
                />
            ))}
            <span className="bg-flair__cursor" ref={cursorRef} />
        </div>
    );
}

export default Background;
