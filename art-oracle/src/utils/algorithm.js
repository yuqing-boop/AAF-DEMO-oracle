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
 * Deduplicates by gallery name (EN) so the same gallery never appears twice.
 *
 * @param {number[]} userVector
 * @param {Array}    booths
 * @returns {Array} — top TOP_N booths (closest first, one per gallery), each augmented with `.distance`
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

  const seen = new Set();
  const results = [];
  for (const booth of scored) {
    const galleryKey = booth.name?.EN ?? booth.id;
    if (seen.has(galleryKey)) continue;
    seen.add(galleryKey);
    results.push(booth);
    if (results.length === TOP_N) break;
  }
  return results;
}
