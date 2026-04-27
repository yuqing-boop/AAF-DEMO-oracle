// Fixed dimension order — must match the index order of booth.dims arrays
export const DIMENSIONS = [
  'colorDepth',
  'energyDynamics',
  'commercialAttribute',
  'spaceStructure',
  'sensitivity',
  'colorSaturation',
];

const DIMENSION_DEFAULT = 3;
const TOP_N = 3;

/**
 * Fisher-Yates shuffle; returns a new array (does not mutate pool).
 * @param {Array} pool
 * @param {number} count
 * @returns {Array}
 */
export function selectQuestions(pool, count = 3) {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

/**
 * Builds the user's 6D vector from answered questions.
 * answers: { [questionId]: 'A' | 'B' | 'C' | 'D' }
 * questions: the full pool (needed to look up dimensionScores by id)
 *
 * For each dimension, averages all scores contributed by answered questions.
 * Dimensions with no data receive DIMENSION_DEFAULT (fault-tolerance).
 *
 * @param {Object} answers
 * @param {Array}  questions
 * @returns {number[]} — length-6 array aligned to DIMENSIONS order
 */
export function computeUserVector(answers, questions) {
  const accumulator = {};
  DIMENSIONS.forEach((dim) => {
    accumulator[dim] = { sum: 0, count: 0 };
  });

  Object.entries(answers).forEach(([questionId, selectedOption]) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;
    const optionData = question.options[selectedOption];
    if (!optionData) return;

    Object.entries(optionData.dimensionScores).forEach(([dim, value]) => {
      if (accumulator[dim] !== undefined) {
        accumulator[dim].sum += value;
        accumulator[dim].count += 1;
      }
    });
  });

  return DIMENSIONS.map((dim) => {
    const { sum, count } = accumulator[dim];
    return count > 0 ? sum / count : DIMENSION_DEFAULT;
  });
}

/**
 * Ranks booths by Euclidean distance to the user vector.
 * booth.dims must be a 6-element array aligned to DIMENSIONS order.
 *
 * @param {number[]} userVector
 * @param {Array}    booths
 * @returns {Array} — top TOP_N booths (closest first), each augmented with `.distance`
 */
export function rankBooths(userVector, booths) {
  const scored = booths.map((booth) => {
    const distanceSq = booth.dims.reduce((acc, boothVal, i) => {
      const diff = userVector[i] - boothVal;
      return acc + diff * diff;
    }, 0);
    return { ...booth, distance: Math.sqrt(distanceSq) };
  });

  scored.sort((a, b) => a.distance - b.distance);
  return scored.slice(0, TOP_N);
}
