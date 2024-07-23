/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'AI Translation Models',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  type: 'success',
  duration: 2000,
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  type: 'error',
  duration: 4000,
}

export const AI_TRANSLATION_MODELS_MESSAGES = {
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
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Imported',
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Deleted',
    },
    TEST_ONE_BY_SERVICE_MODEL_ID: {
      ...CONFIGURATION_SUCCESS,
      message: 'Success'
    },
    IDENTIFY_LANGUAGE_BY_SERVICE_MODEL_ID: {
      ...CONFIGURATION_SUCCESS,
      message: 'Success'
    },
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
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
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
    TEST_ONE_BY_SERVICE_MODEL_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to test model!',
    },
    SHOW_DELETE_MODAL: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to show delete modal!',
    },
    SHOW_TEST_MODAL: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to show test modal!',
    },
    SHOW_IDENTIFY_LANGUAGE_MODAL: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to show language identification modal!',
    },
    IDENTIFY_LANGUAGE_BY_SERVICE_MODEL_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to idenfity language!'
    },
    SAME_LANGUAGES: {
      ...CONFIGURATION_FAILURE,
      message: 'Source and target languages cannot be the same!'
    },
  }
};  
