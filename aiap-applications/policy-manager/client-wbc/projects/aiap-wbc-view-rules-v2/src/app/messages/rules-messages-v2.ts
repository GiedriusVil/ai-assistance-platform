/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: '.notification-container',
  title: 'Rules V2',
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

export const RULES_MESSAGES_V2 = {
  SUCCESS: {
    SAVE_ONE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Rule V2 saved',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_SUCCESS,
      message: 'Rule V2 was loaded',
    },
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Refreshed rules V2'
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully deleted rules V2'
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully imported rules V2'
    },
    EXPORT_MANY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully exported rules V2'
    },
  },
  ERROR: {
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to save rule V2',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to load rule V2',
    },
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to refresh rules V2'
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete rules V2'
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to import rules V2'
    },
    SHOW_RULES_DELETE_MODAL_V2: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to show rules V2 delete modal'
    },
    EXPORT_MANY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to export rules V2'
    },
    GET_PATHS_BY_KEY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to retrieve engagement schema paths'
    }
  }
};
