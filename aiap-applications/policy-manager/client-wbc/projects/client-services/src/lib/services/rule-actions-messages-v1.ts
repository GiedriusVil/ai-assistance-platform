/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIGURATION = {
  target: ".notification-container",
  title: 'Rule Actions',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIGURATION,
  type: 'success',
  duration: 2000,
}

const CONFIGURATION_WARNING = {
  ...CONFIGURATION,
  type: 'warning',
  duration: 2000,
}

const CONFIGURATION_FAILURE = {
  ...CONFIGURATION,
  type: 'error',
  duration: 4000,
}

export const RULE_ACTIONS_MESSAGES_V1 = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Refreshed',
      };
      return RET_VAL;
    },
    LOAD_SAVE_MODAL_DATA: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Refreshed',
      }
      return RET_VAL;
    },
    DELETE_MANY_BY_IDS: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Removed',
      };
      return RET_VAL;
    },
    SAVE_ONE: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Saved',
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
    IMPORT_FROM_FILE: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Imported',
      };
      return RET_VAL;
    }
  },
  WARNING: {
    EXAMPLE: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_WARNING,
        message: 'EXAMPLE',
      };
      return RET_VAL;
    }
  },
  ERROR: {
    FIND_MANY_BY_QUERY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to refresh!',
      };
      return RET_VAL;
    },
    LOAD_SAVE_MODAL_DATA: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to load!',
      };
      return RET_VAL;
    },
    DELETE_MANY_BY_IDS: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to remove!',
      };
      return RET_VAL;
    },
    SAVE_ONE: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to save!',
      };
      return RET_VAL;
    },
    EXPORT_MANY: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to actions!',
      };
      return RET_VAL;
    },
    IMPORT_FROM_FILE: () => {
      const RET_VAL = {
        ...CONFIGURATION_SUCCESS,
        message: 'Unable to import!',
      };
      return RET_VAL;
    },
    SHOW_SAVE_MODAL: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to show save modal!',
      };
      return RET_VAL;
    },
    SHOW_DELETE_MODAL: (context: any = {}, params: any = {}) => {
      const RET_VAL = {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to show delete modal!',
      };
      return RET_VAL;
    }
  }
};
