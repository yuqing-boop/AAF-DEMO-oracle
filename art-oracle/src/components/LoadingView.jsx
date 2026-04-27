import { useEffect, useRef } from 'react';
import { computeUserVector, rankBooths } from '../utils/algorithm.js';
import { DEFAULT_LANGUAGE } from '../utils/i18n.js';
import { RippleColor } from './loading-ui/RippleColor.jsx';
import './LoadingView.css';

const UI_TEXT = {
  EN: '(Placeholder: Lottie Loading Animation) Calculating your artistic energy...',
  CN: '（占位符：Lottie 加载动画）正在计算你的艺术能量……',
};

export default function LoadingView({
  language,
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
        <p className="loading-view__text">
          {UI_TEXT[language] ?? UI_TEXT[DEFAULT_LANGUAGE]}
        </p>
      </div>
    </div>
  );
}
