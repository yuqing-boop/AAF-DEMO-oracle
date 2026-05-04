import { useEffect, useRef } from 'react';
import './MotionCard.css';

// ── Q1 — "energy frequency resonating with breath" ─────────────
export const Q1_VARIANTS = {
  A: 'deep-ink',
  B: 'amber-rings',
  C: 'silver-threads',
  D: 'color-noise',
};

// ── Q2 — "dimension a wind lingers in" ──────────────────────────
export const Q2_VARIANTS = {
  A: 'concentric-wrap',  // purple breathing rings (enclosure)
  B: 'grid-order',       // large blue / powder-blue checker drift (order)
  C: 'parallel-lines',   // thin yellow + thick ivory stripes on dark blue (open)
  D: 'vapor-drift',      // dreamy mint-mist blobs (free)
};

// ── Q4 — "emotions as light" ────────────────────────────────────
export const Q4_VARIANTS = {
  A: 'purple-mist',      // dense slow fog, melancholy (colorSaturation: 1)
  B: 'gray-gradient',    // shifting grey, no colour, balance (colorSaturation: 2)
  C: 'color-bands',      // vivid diagonal strips, joyful (colorSaturation: 4)
  D: 'fluoro-glitch',    // neon blobs pulsing fast, tense (colorSaturation: 5)
};

/** Staggered starts so four simultaneous loops don't look identical */
const VIDEO_OFFSET_BY_KEY = { A: 0, B: 2.5, C: 5, D: 7.5 };

function Stage({ variant }) {
  // ── Q1 ────────────────────────────────────────────────────────
  if (variant === 'deep-ink') {
    return (
      <>
        <span className="mc-blob mc-blob--ink-a" />
        <span className="mc-blob mc-blob--ink-b" />
      </>
    );
  }

  if (variant === 'amber-rings') {
    return (
      <>
        <span className="mc-ring-core" />
        <span className="mc-ring mc-ring--1" />
        <span className="mc-ring mc-ring--2" />
        <span className="mc-ring mc-ring--3" />
        <span className="mc-ring mc-ring--4" />
        <span className="mc-ring mc-ring--5" />
        <span className="mc-ring mc-ring--6" />
        <span className="mc-ring mc-ring--7" />
        <span className="mc-ring mc-ring--8" />
        <span className="mc-ring mc-ring--9" />
        <span className="mc-ring mc-ring--10" />
      </>
    );
  }

  if (variant === 'silver-threads') {
    return (
      <>
        <div className="mc-wave-track mc-wave-track--s1">
          <svg className="mc-wave-svg" viewBox="0 0 1600 60" preserveAspectRatio="none" aria-hidden="true">
            <path className="mc-wave-path mc-wave-path--silver-1"
              d="M0,30 C33,5 67,5 100,30 S167,55 200,30 S267,5 300,30 S367,55 400,30 S467,5 500,30 S567,55 600,30 S667,5 700,30 S767,55 800,30 S867,5 900,30 S967,55 1000,30 S1067,5 1100,30 S1167,55 1200,30 S1267,5 1300,30 S1367,55 1400,30 S1467,5 1500,30 S1567,55 1600,30" />
          </svg>
        </div>
        <div className="mc-wave-track mc-wave-track--s2">
          <svg className="mc-wave-svg" viewBox="0 0 1600 60" preserveAspectRatio="none" aria-hidden="true">
            <path className="mc-wave-path mc-wave-path--silver-2"
              d="M0,30 C50,8 100,8 150,30 S250,52 300,30 S400,8 450,30 S550,52 600,30 S700,8 750,30 S850,52 900,30 S1000,8 1050,30 S1150,52 1200,30 S1300,8 1350,30 S1450,52 1500,30 S1600,8 1650,30" />
          </svg>
        </div>
        <div className="mc-wave-track mc-wave-track--s3">
          <svg className="mc-wave-svg" viewBox="0 0 1600 60" preserveAspectRatio="none" aria-hidden="true">
            <path className="mc-wave-path mc-wave-path--silver-3"
              d="M0,30 C25,14 50,14 75,30 S125,46 150,30 S200,14 225,30 S275,46 300,30 S350,14 375,30 S425,46 450,30 S500,14 525,30 S575,46 600,30 S650,14 675,30 S725,46 750,30 S800,14 825,30 S875,46 900,30 S950,14 975,30 S1025,46 1050,30 S1100,14 1125,30 S1175,46 1200,30 S1250,14 1275,30 S1325,46 1350,30 S1400,14 1425,30 S1475,46 1500,30 S1550,14 1575,30 S1600,46 1625,30" />
          </svg>
        </div>
      </>
    );
  }

  if (variant === 'color-noise') {
    return (
      <>
        <span className="mc-blob mc-blob--noise-r" />
        <span className="mc-blob mc-blob--noise-g" />
        <span className="mc-blob mc-blob--noise-b" />
        <span className="mc-blob mc-blob--noise-y" />
        <span className="mc-blob mc-blob--noise-m" />
        <span className="mc-blob mc-blob--noise-c" />
      </>
    );
  }

  // ── Q2 ────────────────────────────────────────────────────────

  // A — concentric static rings breathing slowly, enclosed feeling
  if (variant === 'concentric-wrap') {
    return (
      <>
        <span className="mc-cring mc-cring--1" />
        <span className="mc-cring mc-cring--2" />
        <span className="mc-cring mc-cring--3" />
        <span className="mc-cring mc-cring--4" />
        <span className="mc-cring mc-cring--5" />
      </>
    );
  }

  // B — CSS grid pattern slowly drifting — ordered, precise
  if (variant === 'grid-order') {
    return <div className="mc-grid" aria-hidden="true" />;
  }

  // C — horizontal lines drifting downward — open, spacious
  if (variant === 'parallel-lines') {
    return <div className="mc-parallels" aria-hidden="true" />;
  }

  // D — large hazy blobs drifting very slowly — formless, free
  if (variant === 'vapor-drift') {
    return (
      <>
        <span className="mc-blob mc-blob--vapor-a" />
        <span className="mc-blob mc-blob--vapor-b" />
        <span className="mc-blob mc-blob--vapor-c" />
      </>
    );
  }

  // ── Q4 ────────────────────────────────────────────────────────

  // A — dense purple fog, melancholy, desaturated
  if (variant === 'purple-mist') {
    return (
      <>
        <span className="mc-blob mc-blob--mist-a" />
        <span className="mc-blob mc-blob--mist-b" />
      </>
    );
  }

  // B — slowly rotating pastel taiji (yin-yang) for balance
  if (variant === 'gray-gradient') {
    return (
      <div className="mc-taiji" aria-hidden="true">
        <div className="mc-taiji__half mc-taiji__half--light" />
        <div className="mc-taiji__half mc-taiji__half--dark" />
        <div className="mc-taiji__dot mc-taiji__dot--light" />
        <div className="mc-taiji__dot mc-taiji__dot--dark" />
      </div>
    );
  }

  // C — vivid diagonal colour bands scrolling, joyful
  if (variant === 'color-bands') {
    return <div className="mc-bands" aria-hidden="true" />;
  }

  // D — neon fluorescent blobs pulsing and clashing, tense
  if (variant === 'fluoro-glitch') {
    return (
      <>
        <span className="mc-blob mc-blob--fluoro-r" />
        <span className="mc-blob mc-blob--fluoro-g" />
        <span className="mc-blob mc-blob--fluoro-b" />
        <span className="mc-blob mc-blob--fluoro-y" />
      </>
    );
  }

  return null;
}

/**
 * @param {{ variant: string, optionKey: string, label: string, hideLabel?: boolean, onClick: () => void }} props
 */
export default function MotionCard({ variant, optionKey, label, hideLabel = false, onClick }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (mq.matches) {
        el.pause();
        return;
      }
      el.currentTime = VIDEO_OFFSET_BY_KEY[optionKey] ?? 0;
      el.play().catch(() => {});
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [optionKey]);

  return (
    <button
      type="button"
      className={`motion-card motion-card--${variant}`}
      onClick={onClick}
      aria-label={`${optionKey}: ${label}`}
    >
      <div className="motion-card__stage" aria-hidden="true">
        <video
          ref={videoRef}
          className="motion-card__bg-video"
          muted
          playsInline
          loop
          aria-hidden="true"
        >
          <source src="/card-bg.mp4" type="video/mp4" />
          <source src="/card-bg.webm" type="video/webm" />
        </video>
        <div className="motion-card__effects">
          <Stage variant={variant} />
        </div>
      </div>

      {/* Frosted tint over motion: purposeful translucency, not generic glass UI */}
      <div className="motion-card__veil" aria-hidden="true" />

      {!hideLabel && (
        <div className="motion-card__label-bar">
          <span className="motion-card__key">{optionKey}</span>
          <span className="motion-card__name">{label}</span>
        </div>
      )}
    </button>
  );
}
