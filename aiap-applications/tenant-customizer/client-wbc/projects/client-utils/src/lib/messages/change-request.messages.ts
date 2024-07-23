/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Conversations',
  duration: 10000
};

const CONFIG_SUCCESS = {
  ...CONFIG,
  type: 'success',
}

const CONFIG_WARNING = {
  ...CONFIG,
  type: 'warning',
}

const CONFIG_ERROR = {
  ...CONFIG,
  type: 'error',
}

export const CHANGE_REQUEST_MESSAGES = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      ...CONFIG_SUCCESS,
      message: 'Reloaded change requests',
    },
    SAVE_ONE: {
      ...CONFIG_SUCCESS,
      message: 'Saved change request'
    },
    EXECUTE_ONE: {
      ...CONFIG_SUCCESS,
      message: 'Execute process started'
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIG_SUCCESS,
      message: 'Change requests deleted'
    },

  },
  WARNING: {
    EXAMPLE: {
      ...CONFIG_WARNING,
      message: 'EXAMPLE',
    }
  },
  ERROR: {
    FIND_MANY_BY_QUERY: {
      ...CONFIG_ERROR,
      message: 'Unable to reload conversations!',
    },
    SAVE_ONE: {
      ...CONFIG_ERROR,
      message: 'Unable to save change request',
    },
    EXECUTE_ONE: {
      ...CONFIG_ERROR,
      message: 'Execute process failed'
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIG_ERROR,
      message: 'Unable to delete change requests'
    },
    MISSING_MANY: {
      ...CONFIG_ERROR,
      message: 'Missing ids of change requests'
    },
  }
};  
