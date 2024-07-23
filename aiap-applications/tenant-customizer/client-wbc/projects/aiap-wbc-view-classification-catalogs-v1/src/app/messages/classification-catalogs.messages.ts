const CONFIG = {
  target: '.notification-container',
  title: 'Classification Catalogs!',
  duration: 4000
};

export const CLASSIFICATION_CATALOG_MESSAGES = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      ...CONFIG,
      type: 'success',
      message: 'Refreshed!',
    },
    SAVE_CLASSIFICATION_CATALOG: {
      ...CONFIG,
      type: 'success',
      message: 'Saved!',

    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIG,
      type: 'success',
      message: 'Imported!',
    }
  },
  WARNING: {
    EXAMPLE: {
      type: 'warning',
      message: 'EXAMPLE',
      ...CONFIG
    }
  },
  ERROR: {
    FIND_MANY_BY_QUERY: {
      ...CONFIG,
      type: 'error',
      message: 'Unable to retrieve!',
    },
    SAVE_CLASSIFICATION_CATALOG: {
      ...CONFIG,
      type: 'error',
      message: 'Unable to save!',
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIG,
      type: 'error',
      message: 'Unable to import!',
    }
  }
};
