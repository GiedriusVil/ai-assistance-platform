/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'AI Translation Model Examples',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  type: 'success',
  duration: 2000,
};

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  type: 'error',
  duration: 4000,
};

const CONFIGURATION_INFO = {
  ...CONFIG,
  type: 'info',
  duration: 2000,
};

export const AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES = {
  INFO: {
    TRAIN_ONE_BY_ID: {
      ...CONFIGURATION_INFO,
      message: 'Started training'
    }
  },
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Refreshed',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_SUCCESS,
      message: 'Retrieved',
    },
    SAVE_ONE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Saved',
    },
    SAVE_MANY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Saved',
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Imported',
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Deleted',
    }
  },
  WARNING: {},
  ERROR: {
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to refresh!',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to retrieve!',
    },
    FIND_ONE_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to retrieve!',
    },
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to save!',
    },
    SAVE_MANY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Unable to save!',
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to import!',
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete!',
    },
    SHOW_DELETE_MODAL: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to show delete modal!',
    },
    TRAIN_ONE_BY_ID: {
      ...CONFIGURATION_INFO,
      message: 'Training error'
    }
  }
};  
