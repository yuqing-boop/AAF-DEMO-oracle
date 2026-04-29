import { useEffect, useRef, useState, useCallback } from 'react';
import { pickString, DEFAULT_LANGUAGE } from '../utils/i18n.js';
import './OracleRevealView.css';

const UI_TEXT = {
  EN: {
    labelCore: 'Core match',
    labelLeft: 'Resonance',
    labelRight: 'Echo',
    home: 'HOME',
    map: 'MAP',
    about: 'ABOUT AAF',
    langLabel: 'EN / 中文',
  },
  CN: {
    labelCore: '核心契合',
    labelLeft: '共鳴',
    labelRight: '迴響',
    home: '首页',
    map: '地图',
    about: '关于 AAF',
    langLabel: 'EN / 中文',
  },
};

const MASK_URLS = [
  '/ui/oracle-mask-1.svg',
  '/ui/oracle-mask-2.svg',
  '/ui/oracle-mask-3.svg',
];

// DOM render order matches original: card2 (left), card1 (center), card3 (right).
// deckPos controls portrait stacking: 0 = first revealed, 1 = second, 2 = third.
const CARD_CONFIGS = [
  { wrapperNum: 2, cardNum: 2, maskUrl: MASK_URLS[1], videoOffset: 2.5, deckPos: 1, labelKey: 'labelLeft' },
  { wrapperNum: 1, cardNum: 1, maskUrl: MASK_URLS[0], videoOffset: 0,   deckPos: 0, labelKey: 'labelCore' },
  { wrapperNum: 3, cardNum: 3, maskUrl: MASK_URLS[2], videoOffset: 5,   deckPos: 2, labelKey: 'labelRight' },
];

const DISMISS_THRESHOLD = 88; // px of travel to trigger a dismiss

/**
 * @typedef {object} BoothLike
 * @property {Record<string, string>=} name
 */

/**
 * @param {object} props
 * @param {string} props.language
 * @param {BoothLike[]} props.topBooths
 * @param {() => void} props.onHome
 */
export default function OracleRevealView({ language, topBooths, onHome }) {
  const t = UI_TEXT[language] ?? UI_TEXT[DEFAULT_LANGUAGE];
  const videoRefs = useRef([null, null, null]);

  // Track portrait vs landscape — swipe is only active in portrait
  const [isPortrait, setIsPortrait] = useState(
    () => typeof window !== 'undefined' ? window.matchMedia('(orientation: portrait)').matches : true
  );
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)');
    const handler = (e) => setIsPortrait(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Front position in a cyclic 3-card deck (portrait swipe loops endlessly)
  const [topIdx, setTopIdx] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);

  // Raw drag tracking via ref to avoid stale closures in move handler
  const dragRef = useRef(null);
  // Triggers re-render to reflect drag position
  const [dragXY, setDragXY] = useState(null);
  // Non-null while the fly-off CSS transition is playing
  const [flyState, setFlyState] = useState(null);

  useEffect(() => {
    CARD_CONFIGS.forEach((cfg, i) => {
      const el = videoRefs.current[i];
      if (!el) return;
      el.currentTime = cfg.videoOffset;
      el.play().catch(() => {});
    });
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (!isPortrait || flyState) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, x: 0, y: 0 };
    setDragXY({ x: 0, y: 0 });
  }, [isPortrait, flyState]);

  const handlePointerMove = useCallback((e) => {
    if (!isPortrait || !dragRef.current || flyState) return;
    const x = e.clientX - dragRef.current.startX;
    const y = e.clientY - dragRef.current.startY;
    dragRef.current.x = x;
    dragRef.current.y = y;
    setDragXY({ x, y });
  }, [isPortrait, flyState]);

  const handlePointerUp = useCallback((e) => {
    const d = dragRef.current;
    if (!isPortrait || !d || flyState) return;
    const { x, y } = d;
    const dist = Math.hypot(x, y);

    if (dist > DISMISS_THRESHOLD) {
      // Project the drag vector out to a full off-screen distance
      const scale = 440 / Math.max(dist, 1);
      setFlyState({ x: x * scale, y: y * scale, rotate: x / 8 });
      setHasSwiped(true);
      dragRef.current = null;
      setDragXY(null);
      setTimeout(() => {
        setTopIdx(i => (i + 1) % 3);
        setFlyState(null);
      }, 450);
    } else {
      dragRef.current = null;
      setDragXY(null);
    }
  }, [isPortrait, flyState]);

  return (
    <div className="oracle-reveal-view" role="region" aria-label={t.labelCore}>
      <div className="oracle-reveal-stage">
        <div
          className="oracle-swipe-hint"
          aria-hidden="true"
          style={{ opacity: (!isPortrait || hasSwiped) ? 0 : undefined }}
        >
          <svg width="20" height="26" viewBox="0 0 20 26" fill="none" aria-hidden="true">
            <line x1="10" y1="24" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <polyline points="3,9 10,2 17,9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="oracle-swipe-hint__label">Swipe</span>
        </div>

        <div className="oracle-reveal-stage__row">
          {CARD_CONFIGS.map((cfg, domIdx) => {
            const rank = ((cfg.deckPos - topIdx) % 3 + 3) % 3; // 0=front, 1=mid, 2=back (cyclic)
            const isFront = rank === 0;
            const isDragging = isFront && dragXY !== null && flyState === null;
            const isFlying  = isFront && flyState !== null;

            let deckClass = 'oracle-deck--hidden';
            if (rank === 0) deckClass = 'oracle-deck--front';
            else if (rank === 1) deckClass = 'oracle-deck--mid';
            else if (rank === 2) deckClass = 'oracle-deck--back';

            const containerStyle = { '--mask-url': `url("${cfg.maskUrl}")` };

            if (isDragging) {
              const { x, y } = dragXY;
              containerStyle.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${x / 20}deg)`;
              containerStyle.transition = 'none';
              containerStyle.animation  = 'none';
              containerStyle.cursor     = 'grabbing';
            } else if (isFlying) {
              containerStyle.transform  = `translate(calc(-50% + ${flyState.x}px), calc(-50% + ${flyState.y}px)) rotate(${flyState.rotate}deg)`;
              containerStyle.opacity    = 0;
              containerStyle.transition = 'transform 0.44s cubic-bezier(0.32, 0, 0.67, 0), opacity 0.36s ease';
              containerStyle.animation  = 'none';
            }

            const booth = topBooths[cfg.deckPos];
            const title = booth ? pickString(booth.name, language) : '—';

            return (
              <div key={cfg.cardNum} className={`oracle-float-wrapper oracle-float-wrapper--${cfg.wrapperNum}`}>
                <div
                  className={[
                    'oracle-card-container',
                    `oracle-card-container--${cfg.cardNum}`,
                    deckClass,
                    isDragging ? 'oracle-deck--dragging' : '',
                  ].join(' ').trim()}
                  style={containerStyle}
                  {...(isFront && isPortrait && !flyState ? {
                    onPointerDown:   handlePointerDown,
                    onPointerMove:   handlePointerMove,
                    onPointerUp:     handlePointerUp,
                    onPointerCancel: handlePointerUp,
                    role:            'button',
                    tabIndex:        0,
                    'aria-label':    title,
                  } : {})}
                >
                  <div className={`oracle-card-shell ${isFront ? 'oracle-card-shell--core' : 'oracle-card-shell--wing'}`}>
                    <div className={`oracle-card oracle-card--${cfg.cardNum}`}>
                      <video
                        ref={el => { videoRefs.current[domIdx] = el; }}
                        className="oracle-card__video"
                        src="/card-bg.webm"
                        muted
                        playsInline
                        loop
                        aria-hidden="true"
                      />
                      <div className="oracle-card__gradient" />
                      <div className="oracle-card__grain" aria-hidden />
                      <div className="oracle-card__pixel-shell" aria-hidden />
                      <div className="oracle-card__final-content">
                        <span className="oracle-card__badge">{t[cfg.labelKey]}</span>
                        <p className="oracle-card__title oracle-card__title--bit">{title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <nav className="oracle-reveal-menu-bar" aria-label="Primary">
        <button type="button" className="oracle-reveal-menu-item is-current" onClick={onHome}>
          {t.home}
        </button>
        <button type="button" className="oracle-reveal-menu-item">
          {t.map}
        </button>
        <button type="button" className="oracle-reveal-menu-item">
          {t.about}
        </button>
        <button type="button" className="oracle-reveal-menu-item oracle-reveal-menu-item--lang">
          {t.langLabel}
        </button>
      </nav>
    </div>
  );
}
