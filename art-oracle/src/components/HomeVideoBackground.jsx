/**
 * Full-viewport looping WebM background (`public/homebg.webm`).
 */
export default function HomeVideoBackground() {
  return (
    <video
      className="home-video-bg"
      src="/homebg.webm"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
