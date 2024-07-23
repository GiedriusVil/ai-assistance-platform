/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

const CONFIG = {
  target: ".notification-container",
  title: 'Users changes',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  duration: 1000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  duration: 4000
}

export const USERS_CHANGES_MESSAGES = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      type: 'success',
      message: 'Refreshed',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT_MANY_BY_QUERY: {
      type: 'success',
      message: 'Imported',
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
      type: 'error',
      message: 'Unable to refresh!',
      ...CONFIGURATION_FAILURE
    },
    FIND_ONE_BY_ID: {
      type: 'error',
      message: 'Unable to find access group change!',
      ...CONFIGURATION_FAILURE
    },
    SAVE_ONE: {
      type: 'error',
      message: 'Unable to save access group change!',
      ...CONFIGURATION_FAILURE
    },
    EXPORT: {
      type: 'error',
      message: 'Unable to export!',
      ...CONFIGURATION_FAILURE
    },
  }
};
