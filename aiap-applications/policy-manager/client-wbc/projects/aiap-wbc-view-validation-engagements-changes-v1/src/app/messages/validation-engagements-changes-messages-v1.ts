/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: '.notification-container',
  title: 'Validation Engagements Changes',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  type: 'success',
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  type: 'error',
  duration: 4000
}

export const VALIDATION_ENGAGEMENTS_CHANGES_MESSAGES_V1 = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Refreshed validation engagements changes'
    },
  },
  ERROR: {
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to refresh validation engagements changes'
    },
    EXPORT: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to export validation engagements changes'
    },
  }
};
