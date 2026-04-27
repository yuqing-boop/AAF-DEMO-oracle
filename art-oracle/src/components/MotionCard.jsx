import './MotionCard.css';

/** Maps option key → motion visual variant (same grid for every quiz step). */
export const Q1_VARIANTS = {
  A: 'deep-ink',
  B: 'amber-pulse',
  C: 'silver-silk',
  D: 'color-noise',
};

function Stage({ variant }) {
  if (variant === 'deep-ink') {
    return (
      <>
        <span className="mc-blob mc-blob--ink-a" />
        <span className="mc-blob mc-blob--ink-b" />
      </>
    );
  }

  if (variant === 'amber-pulse') {
    return (
      <>
        <span className="mc-blob mc-blob--amber-core" />
        <span className="mc-blob mc-blob--amber-halo" />
      </>
    );
  }

  if (variant === 'silver-silk') {
    return (
      <>
        <span className="silk-sweep" />
        <span className="silk-sweep-2" />
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

  return null;
}

/**
 * @param {{ variant: string, optionKey: string, label: string, hideLabel?: boolean, onClick: () => void }} props
 */
export default function MotionCard({ variant, optionKey, label, hideLabel = false, onClick }) {
  return (
    <button
      type="button"
      className={`motion-card motion-card--${variant}`}
      onClick={onClick}
      aria-label={`${optionKey}: ${label}`}
    >
      <div className="motion-card__stage" aria-hidden="true">
        <Stage variant={variant} />
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
