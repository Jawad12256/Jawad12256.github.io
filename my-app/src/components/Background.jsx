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
const NODE = 32;                // grid spacing (matches CSS background-size)
const STEP_MS = 150;            // glide per node (lower = faster/electric)
const SPAWN_INTERVAL_MS = 600;  // avg time between spawns (randomised ±50%)
const POOL_SIZE = 10;           // reusable spark elements (soft cap)
const RUN_H = [2, 4];           // initial run (incl.) for left/right spawns
const RUN_V = [4, 12];          // initial run (incl.) for top/bottom spawns
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
// inclusive integer in [min, max]
const randRange = (min, max) => min + randInt(max - min + 1);
const pick = (arr) => arr[randInt(arr.length)];

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
        const tailAngle = (dc, dr) => {
            if (dc === 1) return 180; // moving right -> tail points left
            if (dc === -1) return 0; // moving left  -> tail points right
            if (dr === 1) return 270; // moving down  -> tail points up
            if (dr === -1) return 90; // moving up    -> tail points down
            return 180;
        };

        // Pool of reusable spark elements + their state.
        const pool = sparkRefs.current
            .filter(Boolean)
            .map((el) => ({
                el,
                alive: false,
                band: 'left',
                col: 0,
                row: 0,
                dir: [1, 0],
                phase: 'initial',
                runLeft: 0,
                timer: null
            }));

        const pixelX = (spark) =>
            spark.band === 'left'
                ? spark.col * NODE
                : window.innerWidth - spark.col * NODE;

        const place = (spark) => {
            spark.el.style.transform = `translate(${pixelX(spark)}px, ${
                spark.row * NODE
            }px)`;
        };

        const inBounds = (col, row) =>
            col >= 0 && col <= cols && row >= 0 && row <= rows;

        // Spawn a spark on a random band edge, heading inward, then start
        // its L-shaped path: straight run -> one 90 turn -> run to edge.
        const spawn = (spark) => {
            spark.band = pick(['left', 'right']);
            const edge = pick(['outer', 'inner', 'top', 'bottom']);

            if (edge === 'outer') {
                spark.col = 0;
                spark.row = randInt(rows + 1);
                spark.dir = [1, 0]; // inward (right within band coords)
                spark.runLeft = randRange(RUN_H[0], RUN_H[1]);
            } else if (edge === 'inner') {
                spark.col = cols;
                spark.row = randInt(rows + 1);
                spark.dir = [-1, 0]; // inward (toward outer edge)
                spark.runLeft = randRange(RUN_H[0], RUN_H[1]);
            } else if (edge === 'top') {
                spark.col = randInt(cols + 1);
                spark.row = 0;
                spark.dir = [0, 1]; // downward into the band
                spark.runLeft = randRange(RUN_V[0], RUN_V[1]);
            } else {
                spark.col = randInt(cols + 1);
                spark.row = rows;
                spark.dir = [0, -1]; // upward into the band
                spark.runLeft = randRange(RUN_V[0], RUN_V[1]);
            }

            spark.phase = 'initial';
            spark.alive = true;

            spark.el.style.setProperty('--spark-step', `${STEP_MS}ms`);
            spark.el.style.setProperty(
                '--tail-angle',
                `${tailAngle(spark.dir[0], spark.dir[1])}deg`
            );

            // Appear STATIONARY at the spawn node (no fly-in), then fade
            // in; once settled, enable gliding and begin stepping.
            spark.el.style.transition = 'opacity 400ms ease';
            place(spark);
            // eslint-disable-next-line no-unused-expressions
            spark.el.offsetWidth; // commit the snapped position
            window.requestAnimationFrame(() => {
                spark.el.classList.add('bg-flair__spark--active');
                spark.timer = setTimeout(() => {
                    spark.el.style.transition = '';
                    step(spark);
                }, 220);
            });
        };

        const die = (spark) => {
            spark.alive = false;
            spark.el.classList.remove('bg-flair__spark--active');
            // element returns to the pool as free once faded out
        };

        const step = (spark) => {
            if (!spark.alive) {
                return;
            }

            // End of the initial inward run: make ONE 90 degree turn.
            if (spark.phase === 'initial' && spark.runLeft <= 0) {
                const [dc] = spark.dir;
                // perpendicular to current axis
                spark.dir =
                    dc !== 0
                        ? pick([
                              [0, 1],
                              [0, -1]
                          ])
                        : pick([
                              [1, 0],
                              [-1, 0]
                          ]);
                spark.phase = 'post-turn';
                spark.el.style.setProperty(
                    '--tail-angle',
                    `${tailAngle(spark.dir[0], spark.dir[1])}deg`
                );
            }

            const nextCol = spark.col + spark.dir[0];
            const nextRow = spark.row + spark.dir[1];

            if (!inBounds(nextCol, nextRow)) {
                die(spark); // reached an edge -> fade out and free
                return;
            }

            spark.col = nextCol;
            spark.row = nextRow;
            if (spark.phase === 'initial') {
                spark.runLeft -= 1;
            }
            place(spark);

            spark.timer = setTimeout(() => step(spark), STEP_MS);
        };

        // Timer-driven spawner: grab a free pooled element each tick.
        let spawnTimer = null;
        const scheduleSpawn = () => {
            const jitter = 0.5 + Math.random(); // 0.5x .. 1.5x
            spawnTimer = setTimeout(() => {
                const free = pool.find((s) => !s.alive);
                if (free) {
                    spawn(free);
                }
                scheduleSpawn();
            }, SPAWN_INTERVAL_MS * jitter);
        };
        scheduleSpawn();

        return () => {
            window.removeEventListener('resize', onResize);
            if (spawnTimer) {
                clearTimeout(spawnTimer);
            }
            pool.forEach((s) => s.timer && clearTimeout(s.timer));
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

    const sparks = Array.from({ length: POOL_SIZE });

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
