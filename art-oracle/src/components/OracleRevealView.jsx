import { useId, useRef } from 'react';
import { pickString, DEFAULT_LANGUAGE } from '../utils/i18n.js';
import './OracleRevealView.css';

const UI_TEXT = {
  EN: {
    continue: 'Continue',
    labelCore: 'Core match',
    labelLeft: 'Resonance',
    labelRight: 'Echo',
  },
  CN: {
    continue: '繼續',
    labelCore: '核心契合',
    labelLeft: '共鳴',
    labelRight: '迴響',
  },
};

const MASK_URLS = [
  '/ui/oracle-mask-1.svg',
  '/ui/oracle-mask-2.svg',
  '/ui/oracle-mask-3.svg',
];

/**
 * @typedef {object} BoothLike
 * @property {Record<string, string>=} name
 */

/**
 * @param {object} props
 * @param {string} props.language
 * @param {BoothLike[]} props.topBooths
 * @param {() => void} props.onComplete
 */
export default function OracleRevealView({ language, topBooths, onComplete }) {
  const t = UI_TEXT[language] ?? UI_TEXT[DEFAULT_LANGUAGE];
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const uid = useId().replace(/:/g, '');

  const booth1 = topBooths[0];
  const booth2 = topBooths[1];
  const booth3 = topBooths[2];

  const title1 = booth1 ? pickString(booth1.name, language) : '—';
  const title2 = booth2 ? pickString(booth2.name, language) : '—';
  const title3 = booth3 ? pickString(booth3.name, language) : '—';

  return (
    <div className="oracle-reveal-view" role="region" aria-label={t.labelCore}>
      <svg className="oracle-reveal-view__filter-defs" aria-hidden width="0" height="0">
        <defs>
          <filter
            id={`${uid}-edge-1`}
            x="-14%"
            y="-14%"
            width="128%"
            height="128%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.022"
              numOctaves="3"
              seed="3"
              result="noise1"
            >
              <animate
                attributeName="baseFrequency"
                dur="16s"
                values="0.018 0.022;0.022 0.016;0.018 0.022"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise1"
              scale="5.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter
            id={`${uid}-edge-2`}
            x="-14%"
            y="-14%"
            width="128%"
            height="128%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.024 0.028"
              numOctaves="3"
              seed="11"
              result="noise2"
            >
              <animate
                attributeName="baseFrequency"
                dur="9.5s"
                values="0.024 0.028;0.032 0.020;0.024 0.028"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise2"
              scale="7.0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter
            id={`${uid}-edge-3`}
            x="-14%"
            y="-14%"
            width="128%"
            height="128%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.021 0.025"
              numOctaves="3"
              seed="19"
              result="noise3"
            >
              <animate
                attributeName="baseFrequency"
                dur="12.4s"
                values="0.021 0.025;0.028 0.019;0.021 0.025"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise3"
              scale="6.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="oracle-reveal-stage">
        <div className="oracle-reveal-stage__row">
          <div
            className="oracle-card-container oracle-card-container--2"
            style={{ '--mask-url': `url("${MASK_URLS[1]}")` }}
          >
            <div className="oracle-card-shell oracle-card-shell--wing">
              <div className="oracle-card oracle-card--2">
                <div
                  className="oracle-card__gradient"
                  style={{ filter: `url(#${uid}-edge-2)`, WebkitFilter: `url(#${uid}-edge-2)` }}
                />
                <div className="oracle-card__grain" aria-hidden />
                <div className="oracle-card__ripple-group oracle-card__ripple-group--delayed-1">
                  <span className="oracle-card__ripple oracle-card__ripple--1" />
                  <span className="oracle-card__ripple oracle-card__ripple--2" />
                  <span className="oracle-card__ripple oracle-card__ripple--3" />
                  <span className="oracle-card__ripple oracle-card__ripple--4" />
                </div>
                <div className="oracle-card__pixel-shell" aria-hidden />
                <div className="oracle-card__final-content">
                  <span className="oracle-card__badge">{t.labelLeft}</span>
                  <p className="oracle-card__title oracle-card__title--bit">{title2}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="oracle-card-container oracle-card-container--1"
            style={{ '--mask-url': `url("${MASK_URLS[0]}")` }}
          >
            <div className="oracle-card-shell oracle-card-shell--core">
              <div className="oracle-card oracle-card--1">
                <div
                  className="oracle-card__gradient"
                  style={{ filter: `url(#${uid}-edge-1)`, WebkitFilter: `url(#${uid}-edge-1)` }}
                />
                <div className="oracle-card__grain" aria-hidden />
                <div className="oracle-card__ripple-group">
                  <span className="oracle-card__ripple oracle-card__ripple--1" />
                  <span className="oracle-card__ripple oracle-card__ripple--2" />
                  <span className="oracle-card__ripple oracle-card__ripple--3" />
                  <span className="oracle-card__ripple oracle-card__ripple--4" />
                </div>
                <div className="oracle-card__pixel-shell" aria-hidden />
                <div className="oracle-card__final-content">
                  <span className="oracle-card__badge">{t.labelCore}</span>
                  <p className="oracle-card__title oracle-card__title--bit">{title1}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="oracle-card-container oracle-card-container--3"
            style={{ '--mask-url': `url("${MASK_URLS[2]}")` }}
          >
            <div className="oracle-card-shell oracle-card-shell--wing">
              <div className="oracle-card oracle-card--3">
                <div
                  className="oracle-card__gradient"
                  style={{ filter: `url(#${uid}-edge-3)`, WebkitFilter: `url(#${uid}-edge-3)` }}
                />
                <div className="oracle-card__grain" aria-hidden />
                <div className="oracle-card__ripple-group oracle-card__ripple-group--delayed-2">
                  <span className="oracle-card__ripple oracle-card__ripple--1" />
                  <span className="oracle-card__ripple oracle-card__ripple--2" />
                  <span className="oracle-card__ripple oracle-card__ripple--3" />
                  <span className="oracle-card__ripple oracle-card__ripple--4" />
                </div>
                <div className="oracle-card__pixel-shell" aria-hidden />
                <div className="oracle-card__final-content">
                  <span className="oracle-card__badge">{t.labelRight}</span>
                  <p className="oracle-card__title oracle-card__title--bit">{title3}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="oracle-reveal-view__footer">
        <button type="button" className="oracle-reveal-view__skip" onClick={() => onCompleteRef.current()}>
          {t.continue}
        </button>
      </div>
    </div>
  );
}
