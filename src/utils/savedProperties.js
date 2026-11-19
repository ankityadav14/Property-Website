const savedPropertiesKey = 'realspace-saved-properties';

export const getSavedPropertyIds = () => {
  try {
    const savedIds = JSON.parse(window.localStorage.getItem(savedPropertiesKey) || '[]');
    return Array.isArray(savedIds)
      ? savedIds.filter((propertyId) => typeof propertyId === 'string')
      : [];
  } catch (error) {
    console.error('Could not read saved properties.', error);
    return [];
  }
};

export const savePropertyIds = (propertyIds) => {
  try {
    window.localStorage.setItem(savedPropertiesKey, JSON.stringify(propertyIds));
    return true;
  } catch (error) {
    console.error('Could not save properties.', error);
    return false;
  }
};
