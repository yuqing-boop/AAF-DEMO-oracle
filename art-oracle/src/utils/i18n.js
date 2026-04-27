/**
 * Bilingual key used across booth/question data and UI.
 * @typedef {'EN' | 'CN'} AppLanguage
 */
export const DEFAULT_LANGUAGE = 'EN';

/**
 * @param {Record<string, string> | undefined} record
 * @param {string} language
 * @returns {string}
 */
export function pickString(record, language) {
  if (!record || typeof record !== 'object') return '';
  if (record[language] != null && String(record[language]).length > 0) {
    return record[language];
  }
  if (record[DEFAULT_LANGUAGE] != null) return record[DEFAULT_LANGUAGE];
  return record.CN ?? '';
}
