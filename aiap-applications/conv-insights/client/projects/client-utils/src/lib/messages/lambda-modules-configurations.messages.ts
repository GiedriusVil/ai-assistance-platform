/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Lamda modules configurations',
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

export const LAMBDA_MODULES_CONFIGURATIONS_MESSAGES = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Refreshed',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_SUCCESS,
      message: 'Refreshed',
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Deleted',
    },
    SAVE_ONE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Saved',
    },
    DELETE_ONE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Deleted',
    },
    IMPORT: {
      ...CONFIGURATION_SUCCESS,
      message: 'Configurations was imported!'
    }
  },
  WARNING: {},
  ERROR: {
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to find configurations!',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to find configuration!',
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete configurations!',
    },
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to save configuration!',
    },
    DELETE_MANY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete configurations!',
    },
    IMPORT: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to import Configurations!'
    }
  }
};  
