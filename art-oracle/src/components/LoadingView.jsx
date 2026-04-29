import { useEffect, useRef } from 'react';
import { computeUserVector, rankBooths } from '../utils/algorithm.js';
import { RippleColor } from './loading-ui/RippleColor.jsx';
import './LoadingView.css';

export default function LoadingView({
  answers,
  questions,
  booths,
  loadingDuration,
  onComplete,
}) {
  // Use a ref so the effect captures stable references without re-running
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const userVector = computeUserVector(answers, questions);
    const top3 = rankBooths(userVector, booths);

    const timer = setTimeout(() => {
      onCompleteRef.current(top3);
    }, loadingDuration);

    return () => clearTimeout(timer);
    // answers, questions (subset shown in quiz), booths, loadingDuration are stable for this mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="loading-view" role="status" aria-live="polite" aria-busy="true">
      <div className="loading-view__content">
        <RippleColor />
      </div>
    </div>
  );
}
