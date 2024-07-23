/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Queries',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  duration: 6000
}

export const QUERIES_CONFIGURATION_MESSAGES = {
  SUCCESS: {
    SAVE_ONE: {
      type: 'success',
      message: 'Query saved!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_ONE_BY_ID: {
      type: 'success',
      message: 'Query loaded!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_MANY_BY_QUERY: {
      type: 'success',
      message: 'Query refreshed!',
      ...CONFIGURATION_SUCCESS
    },
    COMPILE: {
      type: 'success',
      message: 'Query compiled!',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT: {
      type: 'success',
      message: 'Queries imported!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_IDS: {
      type: 'success',
      message: 'Queries removed!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_QUERY: {
      type: 'success',
      message: 'Queries removed!',
      ...CONFIGURATION_SUCCESS
    },
  },
  WARNING: {},
  ERROR: {
    MISSING_MANY: {
      type: 'error',
      message: 'Please select queries!',
      ...CONFIGURATION_FAILURE
    },
    SAVE_ONE: {
      type: 'error',
      message: 'Unable to save query!',
      ...CONFIGURATION_FAILURE
    },
    FIND_ONE_BY_ID: {
      type: 'error',
      message: 'Unable to retrieve query!',
      ...CONFIGURATION_FAILURE
    },
    FIND_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to refresh queries!',
      ...CONFIGURATION_SUCCESS
    },
    COMPILE: {
      type: 'error',
      message: 'Unable to compile!',
      ...CONFIGURATION_FAILURE
    },
    IMPORT: {
      type: 'error',
      message: 'Unable to import queries!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_IDS: {
      type: 'error',
      message: 'Unable to delete queries!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to remove queries',
      ...CONFIGURATION_FAILURE
    },
  }
};
