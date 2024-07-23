/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const CONFIG = {
  target: '.notification-container',
  title: 'Organizations Changes',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  duration: 4000
}

export const ORGANIZATIONS_CHANGES_MESSAGES_V1 = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        type: 'success',
        message: 'Refreshed Organizations Changes',
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
        type: 'error',
        message: 'Unable to refresh Organizations Changes',
        ...CONFIGURATION_FAILURE
      };
      return RET_VAL;
    },
    LOAD_FILTER_OPTIONS: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        type: 'error',
        message: 'Unable to refresh Organizations Changes Filter options',
        ...CONFIGURATION_FAILURE
      };
      return RET_VAL;
    }
  }
};
