import { pickString, DEFAULT_LANGUAGE } from '../utils/i18n.js';
import { RippleColor } from './loading-ui/RippleColor.jsx';
import MotionCard, { Q1_VARIANTS } from './MotionCard.jsx';
import './QuizView.css';

const UI_TEXT = {
  EN: {
    questionCounter: (current, total) => `Question ${current} of ${total}`,
    explosionPlaceholder: 'Transitioning to the next question.',
    interstitialLabel: 'Loading next question',
  },
  CN: {
    questionCounter: (current, total) => `第 ${current} / ${total} 题`,
    explosionPlaceholder: '正在切換到下一题。',
    interstitialLabel: '加載下一题',
  },
};

const OPTION_KEYS = ['A', 'B', 'C', 'D'];

export default function QuizView({
  language,
  questions,
  currentQIndex,
  isExploding,
  onAnswer,
}) {
  const t = UI_TEXT[language] ?? UI_TEXT[DEFAULT_LANGUAGE];
  const currentQuestion = questions[currentQIndex];

  if (!currentQuestion) return null;

  /* Same motion-card grid as Q1 for every spiritual question (A–D options). */
  const isMotion = OPTION_KEYS.every((key) => currentQuestion.options?.[key]);

  if (isExploding) {
    return (
      <div
        className="quiz-view quiz-view--interstitial"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={t.interstitialLabel}
      >
        <div className="quiz-view__interstitial-content">
          <RippleColor />
        </div>
        <span className="quiz-view__visually-hidden">{t.explosionPlaceholder}</span>
      </div>
    );
  }

  if (isMotion) {
    return (
      <div className="quiz-view quiz-view--motion">
        <div className="quiz-view__header">
          <p className="quiz-view__counter">
            {t.questionCounter(currentQIndex + 1, questions.length)}
          </p>
          <p className="quiz-view__prompt">
            {pickString(currentQuestion.prompt, language)}
          </p>
        </div>

        <div className="quiz-view__options--motion">
          {OPTION_KEYS.map((key) => {
            const option = currentQuestion.options[key];
            return (
              <MotionCard
                key={key}
                variant={Q1_VARIANTS[key]}
                optionKey={key}
                label={pickString(option.label, language)}
                hideLabel
                onClick={() => onAnswer(currentQuestion.id, key)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-view">
      <p>{t.questionCounter(currentQIndex + 1, questions.length)}</p>
      <p className="quiz-view__prompt--inline">
        {pickString(currentQuestion.prompt, language)}
      </p>

      <div className="quiz-view__options">
        {OPTION_KEYS.map((key) => {
          const option = currentQuestion.options[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onAnswer(currentQuestion.id, key)}
            >
              [{key}] {pickString(option.label, language)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
