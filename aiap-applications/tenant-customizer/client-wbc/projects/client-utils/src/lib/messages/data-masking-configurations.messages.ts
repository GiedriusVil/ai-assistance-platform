/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: '.notification-container',
  title: 'Data Masking configuration',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  type: 'success',
  duration: 2000
};

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  type: 'error',
  duration: 4000
};

const CONFIGURATION_WARNING = {
  ...CONFIG,
  type: 'warning',
  duration: 4000
};

export const DATA_MASKING_CONFIGURATIONS_MESSAGES = {
  SUCCESS: {
    SAVE_ONE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Configuration saved',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_SUCCESS,
      message: 'Configuration was loaded',
    },
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Refreshed masking configurations!'
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully deleted configurations'
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Imported'
    },
  },
  WARNING: {
    EXPORT_CONFIGURATIONS: {
      ...CONFIGURATION_WARNING,
      message: 'Nothing to export!'
    }
  },
  ERROR: {
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to save configuration',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to load configuration',
    },
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to refresh configurations'
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete configurations'
    },
    SHOW_DATA_MASKING_CONFIGURATIONS_DELETE_MODAL: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to show delete modal!'
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to import!'
    },
  }
};
