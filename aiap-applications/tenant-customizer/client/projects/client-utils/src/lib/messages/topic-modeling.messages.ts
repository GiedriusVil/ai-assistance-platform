/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Topic models',
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


export const TOPIC_MODELING_MESSAGES = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Reloaded conversations',
    },
    SAVE_ONE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Topic Model saved',
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully deleted model'
    },
    EXECUTE_JOB_BY_ID: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully executed job'
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
      message: 'Please select topics!',
      ...CONFIGURATION_FAILURE
  }, 
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to save topic',
    },
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to refresh topics'
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to refresh topic'
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete topics'
    },
    EXECUTE_JOB_BY_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to execute job'
    },
    SHOW_EXECUTE_MODAL: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to open modal'
    },
  }
};
