/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/

const CONFIG = {
  target: ".notification-container",
  title: 'Queries Models Changes',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  duration: 2000
};

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  duration: 4000
}

export const FILTERS_MODELS_CHANGES_MESSAGES = {
  SUCCESS: {
    SAVE_ONE: {
      type: 'success',
      message: 'Queries Model Change saved!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_ONE_BY_ID: {
      type: 'success',
      message: 'Queries Models Changes loaded!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_MANY_BY_QUERY: {
      type: 'success',
      message: 'Queries Models Changes refreshed!',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT_MANY_FROM_FILE: {
      type: 'success',
      message: 'Queries Models Changes Imported!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_IDS: {
      type: 'success',
      message: 'Queries Models Changes removed!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_QUERY: {
      type: 'success',
      message: 'Queries Models Changes removed!',
      ...CONFIGURATION_SUCCESS
    },
  },
  WARNING: {},
  ERROR: {
    SAVE_ONE: {
      type: 'error',
      message: 'Unable to save Queries Service change!',
      ...CONFIGURATION_FAILURE
    },
    FIND_ONE_BY_ID: {
      type: 'error',
      message: 'Unable to retrieve Queries Service change!',
      ...CONFIGURATION_FAILURE
    },
    FIND_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to refresh Queries Models changes!',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT_MANY_FROM_FILE: {
      type: 'error',
      message: 'Unable to import Queries Models changes!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_IDS: {
      type: 'error',
      message: 'Unable to delete Queries Models changes!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to remove Queries Models changes',
      ...CONFIGURATION_FAILURE
    },
  }
};
