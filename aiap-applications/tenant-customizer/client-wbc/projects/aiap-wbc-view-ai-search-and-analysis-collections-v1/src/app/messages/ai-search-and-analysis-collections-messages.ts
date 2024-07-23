/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: '.notification-container',
  title: 'AI Search and Analysis Collections',
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

export const AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES = {
  INFO: {
    SYNCHRONIZE_MANY_BY_QUERY: {
      ...CONFIGURATION_INFO,
      message: 'Collections sychronization started'
    },
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
    },
    SYNCHRONIZE_MANY_BY_QUERY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Sychronization finished'
    },
    QUERY_MANY_BY_SERVICE_PROJECT_ID_AND_COLLECTIONS_IDS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Query finished'
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
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to save!',
    },
    SAVE_MANY: {
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
    SHOW_DELETE_MODAL: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to show delete modal!',
    },
    SHOW_QUERY_MODAL: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to show query modal!',
    },
    SYNCHRONIZE_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Sychronization failed'
    },
    QUERY_MANY_BY_SERVICE_PROJECT_ID_AND_COLLECTIONS_IDS: {
      ...CONFIGURATION_FAILURE,
      message: 'Query failed'
    }
  }
};  
