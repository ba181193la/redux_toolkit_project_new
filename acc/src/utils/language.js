export const getlabel = (id, labels, lng) => {
  if (labels?.Status === 'Failure' || !Array.isArray(labels?.Data)) return '';

  const label = labels?.Data?.find((item) => item.TranslationId === id);

  const translatedlabel =
    lng === 'en' ? label?.FieldEnglishLabel : label?.FieldArabicLabel;
  return translatedlabel || label?.FieldDefaultLabel || '';
};

export const getIncidentlabel = (id, labels, lng) => {
  if (!Array.isArray(labels)) return '';
  const label = labels?.find((item) => item.TranslationId === id);
  const translatedlabel =
    lng === 'en' ? label?.FieldEnglishLabel : label?.FieldArabicLabel;

  return translatedlabel || label?.FieldDefaultLabel || '';
};

//map the data check if obj.MenuId is equal to menuId return index
function findMenuIndex(data, menuId) {
  return data.findIndex((obj) => obj.MenuId === menuId);
}

export const getCustomlabel = (id, labels, lng, menuId) => {
  if (labels?.Status === 'Failure' || !Array.isArray(labels?.Data)) return '';
  //map the data check if obj.MenuId is equal to menuId return index
  const index = findMenuIndex(labels?.Data, menuId);

  const label = labels?.Data[index].Regions[0].Labels?.find(
    (item) => item.TranslationId === id
  );

  const translatedlabel =
    lng === 'en' ? label?.FieldEnglishLabel : label?.FieldArabicLabel;
  return translatedlabel || label?.FieldDefaultLabel || '';
};
