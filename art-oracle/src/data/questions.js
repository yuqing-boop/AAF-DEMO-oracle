// All questions share the same QuizView motion layout: 2×2 MotionCards (A–D).
// Dimension order (matches booth dims array index):
// [0] colorDepth  [1] energyDynamics  [2] commercialAttribute
// [3] spaceStructure  [4] sensitivity  [5] colorSaturation
//
// Bilingual copy keys: EN, CN — use pickString(..., language) in UI.
//
// Chart 影響維度 per question — each option splits 1–5 between the two axes by metaphor:
// Q1: 能量動態 (energyDynamics) + 色彩深度 (colorDepth)
// Q2: 空間結構 (spaceStructure) + 理性感性 (sensitivity)
// Q3: 感性程度 (sensitivity) + 色彩飽和 (colorSaturation)
// Q4: 色彩飽和 (colorSaturation) + 商業屬性 (commercialAttribute)
// Q5: 能量動態 (energyDynamics) + 商業屬性 (commercialAttribute)
//
// Omitted dimensions get fault-tolerance default (3) in computeUserVector.

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
    id: 'q3',
    prompt: {
      EN: 'Close your eyes—what texture leaves a trace on your fingertips?',
      CN: '閉上眼，哪種質地在你的指尖留下了痕跡？',
    },
    options: {
      A: {
        label: { EN: 'Water gradient (silky)', CN: '水波漸變（絲滑）' },
        score: 1,
        dimensionScores: {
          sensitivity: 1,
          colorSaturation: 1,
        },
      },
      B: {
        label: { EN: 'Rock cracks (grainy)', CN: '岩石裂紋（顆粒）' },
        score: 2,
        dimensionScores: {
          sensitivity: 2,
          colorSaturation: 2,
        },
      },
      C: {
        label: { EN: 'Metal refraction (hard)', CN: '金屬折射（硬朗）' },
        score: 4,
        dimensionScores: {
          sensitivity: 4,
          colorSaturation: 3,
        },
      },
      D: {
        label: { EN: 'Soft brushwork (fluffy)', CN: '軟性筆觸（蓬鬆）' },
        score: 5,
        dimensionScores: {
          sensitivity: 5,
          colorSaturation: 4,
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
  {
    id: 'q5',
    prompt: {
      EN: 'Within the flow of time, what rhythm do you pulse with?',
      CN: '在時間的洪流中，你律動在哪種節奏？',
    },
    options: {
      A: {
        label: { EN: 'Extremely slow movement (eternal)', CN: '極慢移動（永恆）' },
        score: 1,
        dimensionScores: {
          energyDynamics: 1,
          commercialAttribute: 2,
        },
      },
      B: {
        label: { EN: 'Heartbeat pulse (regular)', CN: '心跳脈衝（規律）' },
        score: 2,
        dimensionScores: {
          energyDynamics: 2,
          commercialAttribute: 3,
        },
      },
      C: {
        label: { EN: 'Water surface dots (instantaneous)', CN: '水面圓點（瞬時）' },
        score: 4,
        dimensionScores: {
          energyDynamics: 4,
          commercialAttribute: 3,
        },
      },
      D: {
        label: { EN: 'Fractured geometry (realist)', CN: '破碎幾何（寫實）' },
        score: 5,
        dimensionScores: {
          energyDynamics: 5,
          commercialAttribute: 4,
        },
      },
    },
  },
];

export default questions;
