import { useEffect, useRef, useState, useCallback } from 'react';
import { pickString, DEFAULT_LANGUAGE } from '../utils/i18n.js';
import { downloadBlob, recordOracleCardWebm, shareVideoBlob } from '../utils/exportOracleCardWebm.js';
import './OracleRevealView.css';

const UI_TEXT = {
  EN: {
    regionAria: 'Oracle reading',
    home: 'HOME',
    map: 'MAP',
    about: 'ABOUT AAF',
    langLabel: 'EN / 中文',
    closeCard: 'Close',
    focusDialog: 'Oracle card',
    downloadClip: 'Download clip',
    shareInstagram: 'Instagram',
    shareTiktok: 'TikTok',
    exportError: 'Could not export clip.',
    shareFallback: 'Saved the clip. Upload it from your gallery.',
    exporting: 'Exporting…',
  },
  CN: {
    regionAria: '神谕导读',
    home: '首页',
    map: '地图',
    about: '关于 AAF',
    langLabel: 'EN / 中文',
    closeCard: '关闭',
    focusDialog: '神谕卡片',
    downloadClip: '下载短片',
    shareInstagram: 'Instagram',
    shareTiktok: 'TikTok',
    exportError: '无法导出短片。',
    shareFallback: '已保存短片，可在相册中上传。',
    exporting: '导出中…',
  },
};

const MASK_URLS = [
  '/ui/oracle-mask-1.svg',
  '/ui/oracle-mask-2.svg',
  '/ui/oracle-mask-3.svg',
];

/** Booth JSON `id` uses underscores; show as a readable title above the venue `name`. */
function formatBoothId(id) {
  if (!id || typeof id !== 'string') return '—';
  return id.replaceAll('_', ' ');
}

// DOM render order matches original: card2 (left), card1 (center), card3 (right).
// deckPos controls portrait stacking: 0 = first revealed, 1 = second, 2 = third.
const CARD_CONFIGS = [
  { wrapperNum: 2, cardNum: 2, maskUrl: MASK_URLS[1], videoOffset: 2.5, deckPos: 1 },
  { wrapperNum: 1, cardNum: 1, maskUrl: MASK_URLS[0], videoOffset: 0,   deckPos: 0 },
  { wrapperNum: 3, cardNum: 3, maskUrl: MASK_URLS[2], videoOffset: 5,   deckPos: 2 },
];

const DISMISS_THRESHOLD = 88; // px of travel to trigger a dismiss
const TAP_THRESHOLD = 14; // px — tap vs swipe / drag

/**
 * @param {number} clientX
 * @param {number} clientY
 * @param {number} topIdx
 * @param {{ current: Record<number, HTMLElement | null> }} cardRefs
 * @returns {number | null} deckPos
 */
function hitTestDeckPos(clientX, clientY, topIdx, cardRefs) {
  const ranked = CARD_CONFIGS.map((cfg) => {
    const rank = ((cfg.deckPos - topIdx) % 3 + 3) % 3;
    return { deckPos: cfg.deckPos, rank, el: cardRefs.current[cfg.deckPos] };
  }).filter((x) => x.el);
  ranked.sort((a, b) => a.rank - b.rank);
  for (const { deckPos, el } of ranked) {
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
      return deckPos;
    }
  }
  return null;
}

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
  const overlayVideoRef = useRef(null);
  const cardContainerRefs = useRef({});
  const lastClipRef = useRef(null);
  const lsTapRef = useRef(null);

  const [selectedDeckPos, setSelectedDeckPos] = useState(null);
  const [exportBusy, setExportBusy] = useState(false);
  const [shareHint, setShareHint] = useState('');

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

  // Narrow portrait phone → vertical wheel layout (overrides swipe-deck behaviour)
  const [isWheelMode, setIsWheelMode] = useState(
    () => typeof window !== 'undefined'
      ? window.matchMedia('(orientation: portrait) and (max-width: 767px)').matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait) and (max-width: 767px)');
    const handler = (e) => setIsWheelMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Front position in a cyclic 3-card deck (portrait swipe loops endlessly)
  const [topIdx, setTopIdx] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);

  // Raw drag tracking via ref to avoid stale closures in move handler
  const dragRef = useRef(null);
  // Triggers re-render to reflect drag position (swipe-deck mode only)
  const [dragXY, setDragXY] = useState(null);
  // Non-null while the fly-off CSS transition is playing (swipe-deck mode only)
  const [flyState, setFlyState] = useState(null);

  useEffect(() => {
    CARD_CONFIGS.forEach((cfg, i) => {
      const el = videoRefs.current[i];
      if (!el) return;
      el.currentTime = cfg.videoOffset;
      el.play().catch(() => {});
    });
  }, []);

  const closeFocus = useCallback(() => {
    setSelectedDeckPos(null);
    setShareHint('');
    lastClipRef.current = null;
  }, []);

  useEffect(() => {
    if (selectedDeckPos === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeFocus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedDeckPos, closeFocus]);

  const selCfg = selectedDeckPos !== null ? CARD_CONFIGS.find((c) => c.deckPos === selectedDeckPos) : null;
  const selDomIdx = selCfg ? CARD_CONFIGS.indexOf(selCfg) : -1;

  useEffect(() => {
    if (selectedDeckPos === null || !selCfg || selDomIdx < 0) return;
    const src = videoRefs.current[selDomIdx];
    const dst = overlayVideoRef.current;
    if (!dst) return;
    const sync = () => {
      if (src && src.readyState >= 2) {
        const d = src.duration;
        dst.currentTime = d && Number.isFinite(d) ? src.currentTime % d : selCfg.videoOffset;
      } else {
        dst.currentTime = selCfg.videoOffset;
      }
      dst.play().catch(() => {});
    };
    sync();
  }, [selectedDeckPos, selCfg, selDomIdx]);

  const runExport = useCallback(async () => {
    if (selectedDeckPos === null) return null;
    const cfg = CARD_CONFIGS.find((c) => c.deckPos === selectedDeckPos);
    if (!cfg) return null;
    const domIdx = CARD_CONFIGS.indexOf(cfg);
    const video = videoRefs.current[domIdx];
    if (!video) throw new Error('missing video');
    const booth = topBooths[cfg.deckPos];
    const titleText = booth ? pickString(booth.name, language) : '—';
    const badgeText = booth ? formatBoothId(booth.id) : '—';
    const blob = await recordOracleCardWebm({
      video,
      maskUrl: cfg.maskUrl,
      badgeText,
      titleText,
    });
    lastClipRef.current = blob;
    return blob;
  }, [selectedDeckPos, topBooths, language]);

  const handleDownloadClip = useCallback(async () => {
    setShareHint('');
    setExportBusy(true);
    try {
      const blob = await runExport();
      if (!blob) return;
      const booth = topBooths[selectedDeckPos ?? -1];
      const slug = booth?.id ? String(booth.id).replaceAll('_', '-') : 'oracle';
      downloadBlob(blob, `aaf-oracle-${slug}.webm`);
    } catch {
      setShareHint(t.exportError);
    } finally {
      setExportBusy(false);
    }
  }, [runExport, selectedDeckPos, topBooths, t.exportError]);

  const handleShareSocial = useCallback(async () => {
    setShareHint('');
    setExportBusy(true);
    try {
      let blob = lastClipRef.current;
      if (!blob) blob = await runExport();
      if (!blob) return;
      const booth = topBooths[selectedDeckPos ?? -1];
      const slug = booth?.id ? String(booth.id).replaceAll('_', '-') : 'oracle';
      const shared = await shareVideoBlob(blob, `aaf-oracle-${slug}.webm`, 'AAF Oracle');
      if (!shared) {
        downloadBlob(blob, `aaf-oracle-${slug}.webm`);
        setShareHint(t.shareFallback);
      }
    } catch {
      setShareHint(t.exportError);
    } finally {
      setExportBusy(false);
    }
  }, [runExport, selectedDeckPos, topBooths, t.exportError, t.shareFallback]);

  const handlePointerDown = useCallback((e, deckPos) => {
    if (!isPortrait || flyState) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, x: 0, y: 0, deckPos };
    setDragXY({ x: 0, y: 0 });
  }, [isPortrait, flyState]);

  const handlePointerMove = useCallback((e) => {
    if (!isPortrait || !dragRef.current || flyState) return;
    const x = e.clientX - dragRef.current.startX;
    const y = e.clientY - dragRef.current.startY;
    dragRef.current.x = x;
    dragRef.current.y = y;
    // dragXY only needed for swipe-deck drag-follow; skip re-renders in wheel mode
    if (!isWheelMode) setDragXY({ x, y });
  }, [isPortrait, isWheelMode, flyState]);

  const handlePointerUp = useCallback(() => {
    const d = dragRef.current;
    if (!isPortrait || !d) return;
    const { x, y, deckPos } = d;
    dragRef.current = null;
    setDragXY(null);

    if (isWheelMode) {
      if (Math.abs(x) <= TAP_THRESHOLD && Math.abs(y) <= TAP_THRESHOLD) {
        const hit = hitTestDeckPos(d.startX, d.startY, topIdx, cardContainerRefs);
        if (hit !== null) setSelectedDeckPos(hit);
        return;
      }
      // Vertical-only wheel: swipe up (y<0) = advance, swipe down (y>0) = reverse
      if (Math.abs(y) > DISMISS_THRESHOLD && Math.abs(y) > Math.abs(x)) {
        setTopIdx(i => y < 0 ? (i + 1) % 3 : (i + 2) % 3);
        setHasSwiped(true);
      }
      return;
    }

    // Original swipe-deck fly-off for wider portrait screens
    if (flyState) return;
    const dist = Math.hypot(x, y);
    if (dist <= TAP_THRESHOLD && deckPos !== undefined) {
      setSelectedDeckPos(deckPos);
      return;
    }
    if (dist > DISMISS_THRESHOLD) {
      const scale = 440 / Math.max(dist, 1);
      setFlyState({ x: x * scale, y: y * scale, rotate: x / 8 });
      setHasSwiped(true);
      dragRef.current = null;
      setDragXY(null);
      setTimeout(() => {
        setTopIdx(i => (i + 1) % 3);
        setFlyState(null);
      }, 450);
    }
  }, [isPortrait, isWheelMode, flyState, topIdx]);

  return (
    <div className="oracle-reveal-view" role="region" aria-label={t.regionAria}>
      <div className="oracle-reveal-stage">
        <div
          className={['oracle-swipe-hint', isWheelMode ? 'oracle-swipe-hint--wheel' : '']
            .join(' ')
            .trim()}
          aria-hidden="true"
          style={{ opacity: (!isPortrait || hasSwiped) ? 0 : undefined }}
        >
          {isWheelMode ? (
            <>
              <svg width="20" height="26" viewBox="0 0 20 26" fill="none" aria-hidden="true">
                <line x1="10" y1="24" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <polyline points="3,9 10,2 17,9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="oracle-swipe-hint__label">Scroll</span>
              <svg width="20" height="26" viewBox="0 0 20 26" fill="none" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}>
                <line x1="10" y1="24" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <polyline points="3,9 10,2 17,9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          ) : (
            <>
              <svg width="20" height="26" viewBox="0 0 20 26" fill="none" aria-hidden="true">
                <line x1="10" y1="24" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <polyline points="3,9 10,2 17,9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="oracle-swipe-hint__label">Swipe</span>
            </>
          )}
        </div>

        {/* Wheel mode: capture pointer events on the stage row itself */}
        <div
          className="oracle-reveal-stage__row"
          {...(isWheelMode ? {
            onPointerDown:   handlePointerDown,
            onPointerMove:   handlePointerMove,
            onPointerUp:     handlePointerUp,
            onPointerCancel: handlePointerUp,
            style: { touchAction: 'none' },
          } : {})}
        >
          {CARD_CONFIGS.map((cfg, domIdx) => {
            const rank = ((cfg.deckPos - topIdx) % 3 + 3) % 3; // 0=center, 1=bottom, 2=top (cyclic)
            const isFront = rank === 0;
            // drag-follow and fly-off only exist in swipe-deck mode (wider portrait / landscape)
            const isDragging = !isWheelMode && isFront && dragXY !== null && flyState === null;
            const isFlying  = !isWheelMode && isFront && flyState !== null;

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
            const idLine = booth ? formatBoothId(booth.id) : '—';

            const portraitSwipeHandlers = (!isWheelMode && isFront && isPortrait && !flyState)
              ? {
                  onPointerDown: (ev) => handlePointerDown(ev, cfg.deckPos),
                  onPointerMove: handlePointerMove,
                  onPointerUp: handlePointerUp,
                  onPointerCancel: handlePointerUp,
                  role: 'button',
                  tabIndex: 0,
                  'aria-label': booth ? `${idLine}. ${title}` : title,
                }
              : {};

            const landscapeTapHandlers = !isPortrait
              ? {
                  onPointerDown: (ev) => {
                    ev.currentTarget.setPointerCapture(ev.pointerId);
                    lsTapRef.current = {
                      x: ev.clientX,
                      y: ev.clientY,
                      pid: ev.pointerId,
                      dp: cfg.deckPos,
                    };
                  },
                  onPointerUp: (ev) => {
                    const s = lsTapRef.current;
                    if (!s || s.pid !== ev.pointerId || s.dp !== cfg.deckPos) return;
                    lsTapRef.current = null;
                    if (Math.hypot(ev.clientX - s.x, ev.clientY - s.y) <= TAP_THRESHOLD) {
                      setSelectedDeckPos(cfg.deckPos);
                    }
                  },
                  onPointerCancel: () => {
                    lsTapRef.current = null;
                  },
                  role: 'button',
                  tabIndex: 0,
                  'aria-label': booth ? `${idLine}. ${title}` : title,
                }
              : {};

            return (
              <div key={cfg.cardNum} className={`oracle-float-wrapper oracle-float-wrapper--${cfg.wrapperNum}`}>
                <div
                  ref={(el) => {
                    cardContainerRefs.current[cfg.deckPos] = el;
                  }}
                  className={[
                    'oracle-card-container',
                    `oracle-card-container--${cfg.cardNum}`,
                    deckClass,
                    isDragging ? 'oracle-deck--dragging' : '',
                  ].join(' ').trim()}
                  style={containerStyle}
                  {...portraitSwipeHandlers}
                  {...landscapeTapHandlers}
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
                        <span className="oracle-card__badge">{idLine}</span>
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

      {selectedDeckPos !== null && selCfg && (
        <div
          className="oracle-card-focus"
          role="dialog"
          aria-modal="true"
          aria-label={t.focusDialog}
        >
          <button
            type="button"
            className="oracle-card-focus__scrim"
            aria-label={t.closeCard}
            onClick={closeFocus}
          />
          <div className="oracle-card-focus__panel">
            <button type="button" className="oracle-card-focus__x" onClick={closeFocus} aria-label={t.closeCard}>
              ×
            </button>

            <div
              className="oracle-card-focus__slot"
              style={{ '--mask-url': `url("${selCfg.maskUrl}")` }}
            >
              <div className="oracle-card-shell oracle-card-shell--core">
                <div className={`oracle-card oracle-card--${selCfg.cardNum}`}>
                  <video
                    ref={overlayVideoRef}
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
                    <span className="oracle-card__badge">
                      {topBooths[selectedDeckPos] ? formatBoothId(topBooths[selectedDeckPos].id) : '—'}
                    </span>
                    <p className="oracle-card__title oracle-card__title--bit">
                      {topBooths[selectedDeckPos]
                        ? pickString(topBooths[selectedDeckPos].name, language)
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="oracle-card-focus__actions" aria-busy={exportBusy}>
              <button
                type="button"
                className="oracle-card-focus__btn oracle-card-focus__btn--primary"
                disabled={exportBusy}
                onClick={() => void handleDownloadClip()}
              >
                {exportBusy ? t.exporting : t.downloadClip}
              </button>
              <button
                type="button"
                className="oracle-card-focus__btn"
                disabled={exportBusy}
                onClick={() => void handleShareSocial()}
              >
                {t.shareInstagram}
              </button>
              <button
                type="button"
                className="oracle-card-focus__btn"
                disabled={exportBusy}
                onClick={() => void handleShareSocial()}
              >
                {t.shareTiktok}
              </button>
            </div>

            {shareHint ? (
              <p className="oracle-card-focus__hint" role="status">
                {shareHint}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
