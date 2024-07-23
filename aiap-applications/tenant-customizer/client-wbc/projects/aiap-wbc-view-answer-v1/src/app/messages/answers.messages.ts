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
    FIND_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to retrieve answers'
    },
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to save answers'
    },
    TRANSLATE: {
      ...CONFIGURATION_FAILURE,
      message: 'Translation failed'
    },
    FIND_ENGAGEMENTS_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to retrieve engagements'
    }
  }
};
