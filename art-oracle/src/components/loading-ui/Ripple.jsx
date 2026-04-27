import './ripple.css';

/**
 * Three concentric rings expanding from a center dot (sonar / water-ripple look).
 * Color controlled by currentColor — pass a modifier class like ripple--sky.
 *
 * @param {object} props
 * @param {string} [props.className]
 */
export function Ripple({ className = '' }) {
  return (
    <div
      className={`ripple ${className}`.trim()}
      role="presentation"
      aria-hidden
    >
      <span className="ripple__ring ripple__ring--1" />
      <span className="ripple__ring ripple__ring--2" />
      <span className="ripple__ring ripple__ring--3" />
    </div>
  );
}
