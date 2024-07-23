/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Charts',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  duration: 4000
}

export const CHARTS_CONFIGURATION_MESSAGES = {
  SUCCESS: {
    SAVE_ONE: {
      type: 'success',
      message: 'Chart saved!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_ONE_BY_ID: {
      type: 'success',
      message: 'Chart loaded!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_MANY_BY_QUERY: {
      type: 'success',
      message: 'Chart refreshed!',
      ...CONFIGURATION_SUCCESS
    },
    COMPILE: {
      type: 'success',
      message: 'Chart compiled!',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT: {
      type: 'success',
      message: 'Charts imported!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_IDS: {
      type: 'success',
      message: 'Charts removed!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_QUERY: {
      type: 'success',
      message: 'Charts removed!',
      ...CONFIGURATION_SUCCESS
    },
  },
  WARNING: {},
  ERROR: {
    MISSING_MANY: {
      type: 'error',
      message: 'Please select charts!',
      ...CONFIGURATION_FAILURE
    },
    SAVE_ONE: {
      type: 'error',
      message: 'Unable to save chart!',
      ...CONFIGURATION_FAILURE
    },
    FIND_ONE_BY_ID: {
      type: 'error',
      message: 'Unable to retrieve chart!',
      ...CONFIGURATION_FAILURE
    },
    FIND_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to refresh charts!',
      ...CONFIGURATION_SUCCESS
    },
    COMPILE: {
      type: 'error',
      message: 'Unable to compile!',
      ...CONFIGURATION_FAILURE
    },
    IMPORT: {
      type: 'error',
      message: 'Unable to import charts!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_IDS: {
      type: 'error',
      message: 'Unable to delete charts!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to remove charts',
      ...CONFIGURATION_FAILURE
    },
  }
};
