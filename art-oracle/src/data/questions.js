// All questions share the same QuizView motion layout: 2×2 MotionCards (A–D).
// Dimension order (matches booth dims array index):
// [0] colorDepth  [1] energyDynamics  [2] commercialAttribute
// [3] spaceStructure  [4] sensitivity  [5] colorSaturation
//
// Bilingual copy keys: EN, CN — use pickString(..., language) in UI.
//
// These 3 questions cover all 6 dimensions with zero overlap:
// Q1: energyDynamics (1) + colorDepth (0)
// Q2: spaceStructure (3) + sensitivity (4)
// Q4: colorSaturation (5) + commercialAttribute (2)

const questions = [
  {
    id: 'q1',
    prompt: {
      EN: 'At this moment, which energy frequency resonates most with your breath?',
      CN: '此刻，哪種能量頻率最貼合你的呼吸？',
    },
    options: {
      A: {
        label: { EN: 'Deep blue ink (still)', CN: '深藍墨跡（靜）' },
        score: 1,
        dimensionScores: {
          energyDynamics: 1,
          colorDepth: 5,
        },
      },
      B: {
        label: { EN: 'Amber light (warm)', CN: '琥珀光點（溫）' },
        score: 2,
        dimensionScores: {
          energyDynamics: 2,
          colorDepth: 3,
        },
      },
      C: {
        label: { EN: 'Silver thread (dynamic)', CN: '銀色絲線（動）' },
        score: 4,
        dimensionScores: {
          energyDynamics: 4,
          colorDepth: 3,
        },
      },
      D: {
        label: { EN: 'Color noise (chaos)', CN: '彩色噪點（亂）' },
        score: 5,
        dimensionScores: {
          energyDynamics: 5,
          colorDepth: 5,
        },
      },
    },
  },
  {
    id: 'q2',
    prompt: {
      EN: 'If you were a gust of wind, in which dimension would you linger?',
      CN: '如果你是一陣風，你會在哪個維度停留？',
    },
    options: {
      A: {
        label: { EN: 'Concentric circles (enclosure)', CN: '同心圓（包覆）' },
        score: 1,
        dimensionScores: {
          spaceStructure: 2,
          sensitivity: 1,
        },
      },
      B: {
        label: { EN: 'Regular grid (order)', CN: '規律網格（秩序）' },
        score: 2,
        dimensionScores: {
          spaceStructure: 5,
          sensitivity: 2,
        },
      },
      C: {
        label: { EN: 'Infinite parallel lines (open)', CN: '無限平行線（開闊）' },
        score: 4,
        dimensionScores: {
          spaceStructure: 4,
          sensitivity: 3,
        },
      },
      D: {
        label: { EN: 'Blurred vapor (free)', CN: '模糊蒸氣（自由）' },
        score: 5,
        dimensionScores: {
          spaceStructure: 1,
          sensitivity: 5,
        },
      },
    },
  },
  {
    id: 'q4',
    prompt: {
      EN: 'If your emotions turned into light, what state would they manifest?',
      CN: '當你的情緒化為一種光，它呈現什麼狀態？',
    },
    options: {
      A: {
        label: { EN: 'Deep purple mist (melancholy)', CN: '深紫霧氣（憂鬱）' },
        score: 1,
        dimensionScores: {
          colorSaturation: 1,
          commercialAttribute: 2,
        },
      },
      B: {
        label: { EN: 'Gray gradient (balance)', CN: '灰調漸變（平衡）' },
        score: 2,
        dimensionScores: {
          colorSaturation: 2,
          commercialAttribute: 3,
        },
      },
      C: {
        label: { EN: 'Clashing color bands (joyful)', CN: '撞色彩帶（歡快）' },
        score: 4,
        dimensionScores: {
          colorSaturation: 4,
          commercialAttribute: 2,
        },
      },
      D: {
        label: { EN: 'Fluorescent interference (tense)', CN: '螢光干擾（緊張）' },
        score: 5,
        dimensionScores: {
          colorSaturation: 5,
          commercialAttribute: 4,
        },
      },
    },
  },
];

export default questions;
