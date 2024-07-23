/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

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

export const RULES_CONDITIONS_MESSAGES_V2 = {
  SUCCESS: {
    SAVE_ONE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Rule condition V2 saved',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_SUCCESS,
      message: 'Rule condition V2 was loaded',
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully deleted rule conditions V2'
    },
  },
  ERROR: {
    SAVE_ONE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to save rule condition V2',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to load rule condition V2',
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to delete rule conditions V2'
    },
    SHOW_RULES_DELETE_MODAL_V2 : {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to show rules conditions V2 delete modal'
    },
  }
};
