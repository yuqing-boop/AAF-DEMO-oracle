/**
 * Full-viewport background video.
 * Uses a single looping source to reduce compositing cost on mobile.
 */
export default function HomeVideoBackground() {
  return (
    <>
      <video
        className="home-video-bg"
        src="/card-bg.webm"
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        aria-hidden="true"
      />
      {/* SVG fractal noise grain — hides compression artefacts */}
      <div className="home-noise-overlay" aria-hidden="true" />
    </>
  );
}
