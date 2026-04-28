import { useState, useEffect, useRef } from 'react';
import HomeVideoBackground from './HomeVideoBackground.jsx';
import './HomeView.css';

const UI_TEXT = {
  EN: {
    titleMain: 'ART ORACLE',
    titleReading: 'READING',
    step1: 'Answer 3 questions',
    step2: 'Find your destined booth',
    step3: 'Download the oracle card',
    start: 'START READING',
    transitioning: 'ENTERING…',
    langLabel: 'EN / 中文',
    home: 'HOME',
    map: 'MAP',
    about: 'ABOUT AAF',
  },
  CN: {
    titleMain: '艺术神谕',
    titleReading: '导读',
    step1: '答 3 題',
    step2: '找到注定展位',
    step3: '下載神諭卡',
    start: '开始阅读',
    transitioning: '进入中…',
    langLabel: 'EN / 中文',
    home: '首页',
    map: '地图',
    about: '关于 AAF',
  },
};

export default function HomeView({ language, isTransitioning, onLanguageChange, onStart }) {
  const t = UI_TEXT[language] ?? UI_TEXT.EN;
  const [langOpen, setLangOpen] = useState(false);
  const langWrapRef = useRef(null);

  useEffect(() => {
    if (!langOpen) return;
    const close = (e) => {
      if (langWrapRef.current && !langWrapRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [langOpen]);

  const pickLang = (next) => {
    onLanguageChange(next);
    setLangOpen(false);
  };

  return (
    <div className="home-root">
      <HomeVideoBackground />

      <div className="home-shell">
        <main className="home-cards">
          <article className="card title-card" aria-label="Art Oracle Reading">
            <h1 className="title-display">
              <span className="title-line title-line--primary">{t.titleMain}</span>
              <span className="title-line title-line--reading">{t.titleReading}</span>
            </h1>
          </article>

          <div className="home-side-stack">
            <article className="card flow-card" aria-label="How it works">
              <ol className="flow-steps">
                <li>
                  <span className="flow-num">1</span>
                  <span className="flow-text">{t.step1}</span>
                </li>
                <li>
                  <span className="flow-num">2</span>
                  <span className="flow-text">{t.step2}</span>
                </li>
                <li>
                  <span className="flow-num">3</span>
                  <span className="flow-text">{t.step3}</span>
                </li>
              </ol>
            </article>

            {isTransitioning ? (
              <article className="card start-card" aria-label="Start reading">
                <span className="transitioning-label">{t.transitioning}</span>
              </article>
            ) : (
              <button
                type="button"
                className="card start-card"
                aria-label="Start reading"
                onClick={onStart}
              >
                <span className="start-label">{t.start}</span>
              </button>
            )}
          </div>
        </main>
      </div>

      <nav className="home-menu-bar" aria-label="Primary">
        <button type="button" className="menu-item is-current">
          {t.home}
        </button>
        <button type="button" className="menu-item">
          {t.map}
        </button>
        <button type="button" className="menu-item">
          {t.about}
        </button>
        <div className="menu-item-wrap menu-item-wrap--lang" ref={langWrapRef}>
          <button
            type="button"
            className="menu-item menu-item--lang"
            aria-expanded={langOpen}
            aria-haspopup="listbox"
            onClick={() => setLangOpen((v) => !v)}
          >
            {t.langLabel}
          </button>
          {langOpen && (
            <ul className="lang-dropdown-menu lang-dropdown-menu--drop-up" role="listbox">
              <li role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={language === 'EN'}
                  className={language === 'EN' ? 'is-active' : ''}
                  onClick={() => pickLang('EN')}
                >
                  EN
                </button>
              </li>
              <li role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={language === 'CN'}
                  className={language === 'CN' ? 'is-active' : ''}
                  onClick={() => pickLang('CN')}
                >
                  中文
                </button>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}
