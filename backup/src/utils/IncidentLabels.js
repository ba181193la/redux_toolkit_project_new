export const getlabel = (id, labels, lng) => {
  if (!labels || !Array.isArray(labels) || labels.length === 0) {
    return '';
  }

  const label = labels?.find((item) => {
    return item.TranslationId === id;
  });

  const translatedlabel =
    lng === 'en' ? label?.FieldEnglishLabel : label?.FieldArabicLabel;

  return translatedlabel;
};
