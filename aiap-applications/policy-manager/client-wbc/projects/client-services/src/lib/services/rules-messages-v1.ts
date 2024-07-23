/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: '.notification-container',
  title: 'Messages',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  duration: 4000
}

export const RULES_MESSAGES_V1 = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      type: 'success',
      message: 'Refreshed lambda modules',
      ...CONFIGURATION_SUCCESS
    },
  },
  WARNING: {
    EXAMPLE: {
      type: 'warning',
      message: 'EXAMPLE',
      ...CONFIG
    }
  },
  ERROR: {
    FIND_MANY_BY_QUERY: {
      type: 'success',
      message: 'Unable to refresh lambda modules',
      ...CONFIGURATION_FAILURE
    },
  }
};
