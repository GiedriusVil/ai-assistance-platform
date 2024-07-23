/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Filters',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  duration: 6000
}

export const FILTERS_CONFIGURATION_MESSAGES = {
  SUCCESS: {
    SAVE_ONE: {
      type: 'success',
      message: 'FIlter saved!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_ONE_BY_ID: {
      type: 'success',
      message: 'FIlter loaded!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_MANY_BY_QUERY: {
      type: 'success',
      message: 'FIlter refreshed!',
      ...CONFIGURATION_SUCCESS
    },
    COMPILE: {
      type: 'success',
      message: 'FIlter compiled!',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT: {
      type: 'success',
      message: 'FIlters imported!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_IDS: {
      type: 'success',
      message: 'FIlters removed!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_QUERY: {
      type: 'success',
      message: 'FIlters removed!',
      ...CONFIGURATION_SUCCESS
    },
  },
  WARNING: {},
  ERROR: {
    MISSING_MANY: {
      type: 'error',
      message: 'Please select fIlters!',
      ...CONFIGURATION_FAILURE
    },
    SAVE_ONE: {
      type: 'error',
      message: 'Unable to save fIlter!',
      ...CONFIGURATION_FAILURE
    },
    FIND_ONE_BY_ID: {
      type: 'error',
      message: 'Unable to retrieve fIlter!',
      ...CONFIGURATION_FAILURE
    },
    FIND_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to refresh fIlters!',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT: {
      type: 'error',
      message: 'Unable to import fIlters!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_IDS: {
      type: 'error',
      message: 'Unable to delete fIlters!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to remove fIlters',
      ...CONFIGURATION_FAILURE
    },
  }
};
