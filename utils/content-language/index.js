import plPL from './i18n/pl-PL';

/**
 * Defines set of methods for managing entity translations.
 * @module ContentLanguages
 */

const locales = {
  'pl-PL': plPL,
};

/**
 * Defines default entity language.
 * @type {string}
 */
export const DEFAULT_LANGUAGE = 'pl-PL';

/**
 * List of supported language versions.
 * @type {string[]}
 */
export const CONTENT_LANGUAGES = [
  'de-DE',
  'en-GB',
  'pl-PL',
];

/**
 * Checks if provided language is supported by the app.
 * @method
 * @param {string} lng - language to be checked.
 * @return {boolean}
 */
export function isLanguageSupported(lng) {
  return CONTENT_LANGUAGES.some(item => item === lng);
}

/**
 * Returns list of supported languages.
 * @method
 * @param {string[]} lngList - list of languages.
 * @return {string[]} - filtered language list.
 */
export function getSupportedLanguages(lngList = []) {
  return lngList.filter(item => isLanguageSupported(item));
}

/**
 * Returns pretty label.
 * @param {string} lng - label language code
 * @param {Object} options
 * @param {string} options.locale - defines base locale
 * @param {boolean} [options.withCode] - show language code beside label
 * @return {string} - translated label
 */
export function getLanguageLabel(lng, options = {}) {
  const { locale, withCode } = options;

  if (!locales[locale]) {
    return '';
  }

  let label = locales[locale].labels[lng];

  if (withCode !== false) {
    label = `${label} ${String.fromCharCode(8212)} ${lng}`;
  }

  return label;
}
