import { Ripple } from './Ripple.jsx';

/**
 * Row of three color-coded ripple loaders (vector SVG animation).
 */
export function RippleColor() {
  return (
    <div className="ripple-color">
      <Ripple className="ripple--sky" />
      <Ripple className="ripple--violet" />
      <Ripple className="ripple--amber" />
    </div>
  );
}
