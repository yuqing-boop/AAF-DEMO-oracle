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
        <span className="mc-blob--amber-a" />
        <span className="mc-blob--amber-b" />
        <span className="mc-blob--amber-c" />
      </>
    );
  }

  if (variant === 'silver-threads') {
    return (
      <div className="mc-wave-track" aria-hidden="true">
        <svg className="mc-wave-svg" viewBox="0 0 1600 80" preserveAspectRatio="none">
          {/* Ghost persistence echo — static, no animation */}
          <path className="mc-wave-path--echo"
            d="M0,40 C40,10 80,10 120,40 S200,70 240,40 S320,10 360,40 S440,70 480,40 S560,10 600,40 S680,70 720,40 S800,10 840,40 S920,70 960,40 S1040,10 1080,40 S1160,70 1200,40 S1280,10 1320,40 S1400,70 1440,40 S1520,10 1560,40 S1600,70 1600,40" />
          {/* Primary thread — one crisp glowing line */}
          <path className="mc-wave-path--primary"
            d="M0,40 C40,10 80,10 120,40 S200,70 240,40 S320,10 360,40 S440,70 480,40 S560,10 600,40 S680,70 720,40 S800,10 840,40 S920,70 960,40 S1040,10 1080,40 S1160,70 1200,40 S1280,10 1320,40 S1400,70 1440,40 S1520,10 1560,40 S1600,70 1600,40" />
        </svg>
      </div>
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
