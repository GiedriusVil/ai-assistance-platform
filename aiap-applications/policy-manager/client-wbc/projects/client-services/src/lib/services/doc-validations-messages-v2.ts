/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Document Validation Transactions',
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

export const DOC_VALIDATIONS_MESSAGES_V2 = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Refreshed',
      };
      return RET_VAL;
    },
    EXPORT_MANY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Exported',
      };
      return RET_VAL;
    },
  },
  ERROR: {
    FIND_MANY_BY_QUERY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to refresh!',
      };
      return RET_VAL;
    },
    EXPORT_MANY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to export!',
      };
      return RET_VAL;
    },
    GENERATE_REPORT: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to generate report!',
      };
      return RET_VAL;
    },
    LOAD_FILTER_OPTIONS: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to load options!',
      };
      return RET_VAL;
    }
  }
};
