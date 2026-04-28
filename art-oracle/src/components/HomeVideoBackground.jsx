import { useEffect, useRef } from 'react';

/**
 * Full-viewport ping-pong background.
 * Alternates between `homebg.webm` (forward) and `homebg-rev.webm` (reverse).
 *
 * Flash-free swap strategy:
 *   - The standby video is always opacity 1 underneath (z-index 0).
 *   - Only the top video (z-index 1) fades OUT, revealing the already-visible one below.
 *   - Neither video ever goes through a simultaneous dual-fade that would expose the dark page.
 */
export default function HomeVideoBackground() {
  const fwdRef = useRef(null);
  const revRef = useRef(null);
  /** @type {React.MutableRefObject<'fwd'|'rev'>} */
  const activeRef = useRef('fwd');

  useEffect(() => {
    const fwd = fwdRef.current;
    const rev = revRef.current;
    if (!fwd || !rev) return;

    const swap = () => {
      const outgoing = activeRef.current === 'fwd' ? fwd : rev;
      const incoming = activeRef.current === 'fwd' ? rev : fwd;
      activeRef.current  = activeRef.current === 'fwd' ? 'rev' : 'fwd';

      // Incoming is already underneath at opacity 1 — start it playing now
      incoming.currentTime = 0;
      void incoming.play().catch(() => {});

      // Bring incoming on top, fade outgoing out on top of it
      incoming.style.zIndex = '0';
      outgoing.style.zIndex = '1';
      outgoing.style.opacity = '0'; // CSS transition fades it out, revealing incoming below

      // After fade completes, reset outgoing for next swap
      const onFaded = () => {
        outgoing.removeEventListener('transitionend', onFaded);
        outgoing.pause();
        outgoing.currentTime = 0;
        outgoing.style.zIndex = '0';
        outgoing.style.opacity = '1'; // restore full opacity while hidden underneath
      };
      outgoing.addEventListener('transitionend', onFaded);
    };

    fwd.addEventListener('ended', swap);
    rev.addEventListener('ended', swap);

    // Trigger reverse preload once forward starts — browser has full video duration to download it
    const startFwd = () => {
      rev.preload = 'auto';
      rev.load();
    };
    fwd.addEventListener('playing', startFwd, { once: true });

    void fwd.play().catch(() => {
      const retry = () => void fwd.play().catch(() => {});
      document.addEventListener('pointerdown', retry, { once: true });
      document.addEventListener('keydown', retry, { once: true });
    });

    return () => {
      fwd.removeEventListener('ended', swap);
      rev.removeEventListener('ended', swap);
      fwd.removeEventListener('playing', startFwd);
    };
  }, []);

  const sharedStyle = {
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
    transition: 'opacity 0.4s ease',
  };

  return (
    <>
      {/* Forward video — starts on top and playing */}
      <video
        ref={fwdRef}
        className="home-video-bg"
        src="/homebg.webm"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{ ...sharedStyle, opacity: 1, zIndex: 1 }}
      />
      {/* Reverse video — underneath at full opacity, ready to be revealed */}
      <video
        ref={revRef}
        className="home-video-bg"
        src="/homebg-rev.webm"
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        style={{ ...sharedStyle, opacity: 1, zIndex: 0 }}
      />
      {/* SVG fractal noise grain — hides compression artefacts, zero network cost */}
      <div className="home-noise-overlay" aria-hidden="true" />
    </>
  );
}
