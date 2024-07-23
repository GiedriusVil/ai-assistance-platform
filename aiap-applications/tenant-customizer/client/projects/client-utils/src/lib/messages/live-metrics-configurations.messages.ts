/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Live metrics configuration',
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

export const MESSAGES_LIVE_METRICS_CONFIGURATION = {
  SUCCESS: {
    SAVE_ONE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Configuration saved',
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
    },
  },
  ERROR: {
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to save configuration',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to retrieve configuration!'
    },
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to refresh configurations'
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete configurations'
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to import!'
    },
  }
};
