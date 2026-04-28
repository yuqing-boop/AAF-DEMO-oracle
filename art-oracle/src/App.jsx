import { useState, useCallback } from 'react';
import questions from './data/questions.js';
import booths from './data/booths.json';
import { selectQuestions, computeUserVector, rankBooths } from './utils/algorithm.js';
import HomeVideoBackground from './components/HomeVideoBackground.jsx';
import HomeView from './components/HomeView.jsx';
import QuizView from './components/QuizView.jsx';
import LoadingView from './components/LoadingView.jsx';
import OracleRevealView from './components/OracleRevealView.jsx';
import ResultView from './components/ResultView.jsx';

// --- Timing constants (ms) — swap these when wiring real animations ---
const TRANSITION_HOME_TO_QUIZ_MS = 1000;
const EXPLOSION_DURATION_MS = 600;
const LOADING_DURATION_MS = 4500;

const INITIAL_STATE = {
  view: 'home',
  language: 'EN',
  selectedQs: [],
  currentQIndex: 0,
  answers: {},
  isExploding: false,
  isTransitioning: false,
  topBooths: [],
};

export default function App() {
  const [view, setView] = useState(INITIAL_STATE.view);
  const [language, setLanguage] = useState(INITIAL_STATE.language);
  const [selectedQs, setSelectedQs] = useState(INITIAL_STATE.selectedQs);
  const [currentQIndex, setCurrentQIndex] = useState(INITIAL_STATE.currentQIndex);
  const [answers, setAnswers] = useState(INITIAL_STATE.answers);
  const [isExploding, setIsExploding] = useState(INITIAL_STATE.isExploding);
  const [isTransitioning, setIsTransitioning] = useState(INITIAL_STATE.isTransitioning);
  const [topBooths, setTopBooths] = useState(INITIAL_STATE.topBooths);

  // --- Handlers ---

  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  const handleStart = useCallback(() => {
    const drawn = selectQuestions(questions, 3);
    setSelectedQs(drawn);
    setCurrentQIndex(0);
    setAnswers({});
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
      setView('quiz');
    }, TRANSITION_HOME_TO_QUIZ_MS);
  }, []);

  const handleAnswer = useCallback(
    (questionId, selectedOption) => {
      const updatedAnswers = { ...answers, [questionId]: selectedOption };
      setAnswers(updatedAnswers);
      setIsExploding(true);

      setTimeout(() => {
        setIsExploding(false);
        const isLastQuestion = currentQIndex === selectedQs.length - 1;
        if (isLastQuestion) {
          setView('loading');
        } else {
          setCurrentQIndex((prev) => prev + 1);
        }
      }, EXPLOSION_DURATION_MS);
    },
    [answers, currentQIndex, selectedQs]
  );

  const handleLoadingComplete = useCallback((computedTopBooths) => {
    setTopBooths(computedTopBooths);
    setView('oracleReveal');
  }, []);

  const handleOracleRevealComplete = useCallback(() => {
    setView('result');
  }, []);

  const handleRestart = useCallback(() => {
    setView(INITIAL_STATE.view);
    setLanguage(language); // preserve language choice on restart
    setSelectedQs(INITIAL_STATE.selectedQs);
    setCurrentQIndex(INITIAL_STATE.currentQIndex);
    setAnswers(INITIAL_STATE.answers);
    setIsExploding(INITIAL_STATE.isExploding);
    setIsTransitioning(INITIAL_STATE.isTransitioning);
    setTopBooths(INITIAL_STATE.topBooths);
  }, [language]);

  // --- View router ---
  const usePersistentVideoBg = view === 'quiz' || view === 'loading';

  return (
    <div>
      {usePersistentVideoBg && <HomeVideoBackground />}
      {view === 'home' && (
        <HomeView
          language={language}
          isTransitioning={isTransitioning}
          onLanguageChange={handleLanguageChange}
          onStart={handleStart}
        />
      )}
      {view === 'quiz' && (
        <QuizView
          language={language}
          questions={selectedQs}
          currentQIndex={currentQIndex}
          isExploding={isExploding}
          onAnswer={handleAnswer}
        />
      )}
      {view === 'loading' && (
        <LoadingView
          language={language}
          answers={answers}
          questions={selectedQs}
          booths={booths}
          loadingDuration={LOADING_DURATION_MS}
          onComplete={handleLoadingComplete}
        />
      )}
      {view === 'oracleReveal' && (
        <OracleRevealView language={language} topBooths={topBooths} onComplete={handleOracleRevealComplete} />
      )}
      {view === 'result' && (
        <ResultView
          language={language}
          topBooths={topBooths}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
