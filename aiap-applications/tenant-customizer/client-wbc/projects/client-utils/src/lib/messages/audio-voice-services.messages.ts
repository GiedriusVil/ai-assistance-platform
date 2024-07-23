/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Audio Voice Services',
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


export const AUDIO_VOICE_SERVICES_MESSAGES = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Reloaded services',
    },
    SAVE_ONE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Audio/Voice service saved',
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully deleted service'
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully imported services'
    },

  },
  WARNING: {
    EXPORT_CONFIGURATIONS: {
      ...CONFIGURATION_WARNING,
      message: 'Nothing to export!'
    },
  },
  ERROR: {
    MISSING_MANY: {
      type: 'error',
      message: 'Please select services!',
      ...CONFIGURATION_FAILURE
  }, 
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to save service',
    },
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to refresh services'
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to refresh service'
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete services'
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to import services'
    },
  }
};
