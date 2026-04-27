import { pickString, DEFAULT_LANGUAGE } from '../utils/i18n.js';

const UI_TEXT = {
  EN: {
    heading: 'Your Soul Booths',
    boothLabel: 'Booth',
    matchLabel: 'Why you match:',
    restart: 'Start Again',
  },
  CN: {
    heading: '你的灵魂展位',
    boothLabel: '展位',
    matchLabel: '为何与你契合：',
    restart: '重新开始',
  },
};

export default function ResultView({ language, topBooths, onRestart }) {
  const t = UI_TEXT[language] ?? UI_TEXT[DEFAULT_LANGUAGE];

  return (
    <div>
      <h2>{t.heading}</h2>

      {topBooths.map((booth, index) => (
        <div key={booth.id}>
          <h3>
            #{index + 1} — {pickString(booth.name, language)}
          </h3>
          <p>
            {t.boothLabel}: {booth.number}
          </p>
          <p>
            {t.matchLabel} {pickString(booth.matchReason, language)}
          </p>
        </div>
      ))}

      <button onClick={onRestart}>{t.restart}</button>
    </div>
  );
}
