/**
 * Pick bilingual catalog fields: prefer *_ar when language is Arabic.
 * Falls back to English if Arabic is empty.
 */
export function localized(item, field, language = 'en') {
  if (!item) return '';
  const isAr = String(language || '').startsWith('ar');
  if (isAr) {
    const arValue = item[`${field}_ar`];
    if (arValue != null && String(arValue).trim() !== '') return String(arValue);
  }
  const value = item[field];
  return value == null ? '' : String(value);
}

export function localizedList(items, field, language = 'en') {
  if (!Array.isArray(items)) return [];
  return items.map((item) => localized(item, field, language)).filter(Boolean);
}
