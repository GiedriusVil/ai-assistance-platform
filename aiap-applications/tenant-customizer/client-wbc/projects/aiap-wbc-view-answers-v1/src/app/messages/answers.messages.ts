/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const CONFIG = {
  target: '.notification-container',
  title: 'Answers',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  type: 'success',
  duration: 2000
};

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  type: 'error',
  duration: 4000
};

const CONFIGURATION_WARNING = {
  ...CONFIG,
  type: 'warning',
  duration: 4000
};

export const ANSWERS_MESSAGES = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_SUCCESS,
      message: 'Refreshed answer store!'
    },
    SAVE_ONE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully saved answer'
    },
    DELETE_MANY_BY_KEYS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully deleted answers'
    },
    ANSWER_STORE_PULLED: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully pulled answer store'
    },
    ANSWER_STORE_ROLLED_BACK: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully rolled back answer store'
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Imported'
    },
    TRANSLATE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully translated!'
  }
  },
  WARNING: {
    EXPORT_ANSWERS: {
      ...CONFIGURATION_WARNING,
      message: 'Nothing to export!'
    }
  },
  ERROR: {
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to refresh answer store'
    },
    FIND_MANY_BY_QUERY_ERROR: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to retrieve answers'
    },
    DELETE_MANY_BY_KEYS: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete answers'
    },
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to retrieve answer'
    },
    FAILED_TO_PULL_ANSWER_STORE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to pull answer store'
    },
    FAILED_FIND_ANSWER_STORE_RELEASES: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to retrieve answer store releases'
    },
    FAILED_TO_ROLLBACK_ANSWER_STORE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to rollback answer store!'
    },
    IMPORT_MANY_FROM_FILE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to import!'
    },
    IMPORT_MANY_WRONG_FILE_TYPE: {
      ...CONFIGURATION_FAILURE,
      message: 'Please select json or xls file formats'
    },
    TRANSLATE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to translate!'
    },
    COMPARE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to compare answers!'
    }
  }
};
