/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Buy Rules Changes',
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

export const BUY_RULES_CHANGES_MESSAGES = {
  SUCCESS: {
      FIND_MANY_BY_QUERY: {
        ...CONFIGURATION_SUCCESS,
        message: 'Refreshed',
      },
      EXPORT_MANY: {
        ...CONFIGURATION_SUCCESS,
        message: 'Exported',
      },
  },
  ERROR: {
      FIND_MANY_BY_QUERY: {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to refresh!',
      },
      EXPORT_MANY: {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to export!',
      },
      LOAD_FILTER_OPTIONS: {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to load options!',
      }
  }
};