/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Dashboards',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  duration: 4000
}

export const DASHBOARDS_CONFIGURATION_MESSAGES = {
  SUCCESS: {
    SAVE_ONE: {
      type: 'success',
      message: 'Dashboard saved!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_ONE_BY_ID: {
      type: 'success',
      message: 'Dashboard loaded!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_MANY_BY_QUERY: {
      type: 'success',
      message: 'Dashboard refreshed!',
      ...CONFIGURATION_SUCCESS
    },
    COMPILE: {
      type: 'success',
      message: 'Dashboard compiled!',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT: {
      type: 'success',
      message: 'Dashboards imported!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_IDS: {
      type: 'success',
      message: 'Dashboards removed!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_QUERY: {
      type: 'success',
      message: 'Dashboards removed!',
      ...CONFIGURATION_SUCCESS
    },
  },
  WARNING: {},
  ERROR: {
    MISSING_MANY: {
      type: 'error',
      message: 'Please select dashboard!',
      ...CONFIGURATION_FAILURE
    },
    SAVE_ONE: {
      type: 'error',
      message: 'Unable to save dashboard!',
      ...CONFIGURATION_FAILURE
    },
    FIND_ONE_BY_ID: {
      type: 'error',
      message: 'Unable to retrieve dashboard!',
      ...CONFIGURATION_FAILURE
    },
    FIND_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to refresh dashboards!',
      ...CONFIGURATION_SUCCESS
    },
    COMPILE: {
      type: 'error',
      message: 'Unable to compile!',
      ...CONFIGURATION_FAILURE
    },
    IMPORT: {
      type: 'error',
      message: 'Unable to import dashboards!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_IDS: {
      type: 'error',
      message: 'Unable to delete dashboards!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to remove dashboards',
      ...CONFIGURATION_FAILURE
    },
  }
};
