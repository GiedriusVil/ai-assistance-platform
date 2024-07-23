/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: '.notification-container',
  title: 'Validation Engagements',
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

export const VALIDATION_ENGAGEMENTS_MESSAGES_V1 = {
  SUCCESS: {
    SAVE_ONE: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Validation engagement saved',
      };
      return RET_VAL;
    },
    FIND_ONE_BY_KEY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Validation engagement was loaded',
      }
      return RET_VAL;
    },
    FIND_MANY_BY_QUERY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Refreshed validation engagements'
      };
      return RET_VAL;
    },
    DELETE_MANY_BY_KEYS: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Successfully deleted validation engagements'
      };
      return RET_VAL;
    },
    IMPORT_MANY_FROM_FILE: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Successfully imported validaiton engagements'
      };
      return RET_VAL;
    },
  },
  ERROR: {
    SAVE_ONE: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to save validaiton engagement',
      };
      return RET_VAL;
    },
    FIND_ONE_BY_ID: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to load validation engagement',
      };
      return RET_VAL;
    },
    FIND_ONE_BY_KEY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to load validation engagement',
      };
      return RET_VAL;
    },
    FIND_MANY_BY_QUERY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to refresh validation engagements'
      };
      return RET_VAL;
    },
    DELETE_MANY_BY_KEYS: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to delete validation engagements'
      };
      return RET_VAL;
    },
    IMPORT_MANY_FROM_FILE: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to import validation engagements'
      };
      return RET_VAL;
    },
    SHOW_VALIDATION_ENGAGEMENTS_DELETE_MODAL: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to show validation engagements delete modal'
      };
      return RET_VAL;
    }
  }
};
