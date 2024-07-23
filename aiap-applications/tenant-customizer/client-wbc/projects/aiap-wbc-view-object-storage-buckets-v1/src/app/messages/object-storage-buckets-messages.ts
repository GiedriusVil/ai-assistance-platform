/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: '.notification-container',
  title: 'Object Storage Buckets',
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

export const OBJECT_STORAGE_BUCKETS_MESSAGES = {
  SUCCESS: {
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Deleted',
    },
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
  },
  WARNING: {},
  ERROR: {
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete!',
    },
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
    SHOW_DELETE_MODAL: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to show delete modal!',
    }
  }
};  
