/**
 * Full-viewport background video.
 * Uses a single looping source to reduce compositing cost on mobile.
 */
export default function HomeVideoBackground() {
  return (
    <>
      <video
        className="home-video-bg"
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        aria-hidden="true"
      >
        <source src="/card-bg.mp4" type="video/mp4" />
        <source src="/card-bg.webm" type="video/webm" />
      </video>
      {/* SVG fractal noise grain — hides compression artefacts */}
      <div className="home-noise-overlay" aria-hidden="true" />
    </>
  );
}
