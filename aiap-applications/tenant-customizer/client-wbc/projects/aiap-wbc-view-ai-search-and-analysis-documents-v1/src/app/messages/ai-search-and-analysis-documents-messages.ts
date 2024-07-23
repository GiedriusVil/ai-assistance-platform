/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: '.notification-container',
  title: 'AI Search and Analysis Documents',
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

export const AI_SEARCH_AND_ANALYSIS_DOCUMENTS_MESSAGES = {
  INFO: {
  },
  SUCCESS: {
    LIST_MANY_BY_QUERY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Refreshed',
    },
    DELETE_MANY_BY_DOCUMENTS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Deleted',
    },
  },
  WARNING: {},
  ERROR: {
    LIST_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to refresh!',
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete!',
    },
    DELETE_MANY_BY_DOCUMENTS: {
      ...CONFIGURATION_FAILURE,
      message: 'Deleted',
    },
    SHOW_DELETE_MODAL: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to show delete modal!',
    },
  }
};  
