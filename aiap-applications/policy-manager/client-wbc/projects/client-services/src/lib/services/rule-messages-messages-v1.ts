/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: '.notification-container',
  title: 'Rules messages',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  duration: 4000
}

export const RULES_MESSAGES_MESSAGES_V1 = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        type: 'success',
        message: 'Refreshed lambda modules',
        ...CONFIGURATION_SUCCESS
      };
      return RET_VAL;
    },
  },
  WARNING: {
    EXAMPLE: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        type: 'warning',
        message: 'EXAMPLE',
        ...CONFIG
      };
      return RET_VAL;
    }
  },
  ERROR: {
    FIND_MANY_BY_QUERY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        type: 'success',
        message: 'Unable to refresh lambda modules',
        ...CONFIGURATION_FAILURE
      }
      return RET_VAL;
    },
  }
};
