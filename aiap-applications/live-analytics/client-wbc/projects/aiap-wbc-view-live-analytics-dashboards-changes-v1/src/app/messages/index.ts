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
  title: 'Dashboard Models Changes',
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
      message: 'Dashboards Model Change saved!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_ONE_BY_ID: {
      type: 'success',
      message: 'Dashboards Models Changes loaded!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_MANY_BY_QUERY: {
      type: 'success',
      message: 'Dashboards Models Changes refreshed!',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT_MANY_FROM_FILE: {
      type: 'success',
      message: 'Dashboards Models Changes Imported!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_IDS: {
      type: 'success',
      message: 'Dashboards Models Changes removed!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_QUERY: {
      type: 'success',
      message: 'Dashboards Models Changes removed!',
      ...CONFIGURATION_SUCCESS
    },
  },
  WARNING: {},
  ERROR: {
    SAVE_ONE: {
      type: 'error',
      message: 'Unable to save Dashboards Service change!',
      ...CONFIGURATION_FAILURE
    },
    FIND_ONE_BY_ID: {
      type: 'error',
      message: 'Unable to retrieve Dashboards Service change!',
      ...CONFIGURATION_FAILURE
    },
    FIND_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to refresh Dashboards Models changes!',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT_MANY_FROM_FILE: {
      type: 'error',
      message: 'Unable to import Dashboards Models changes!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_IDS: {
      type: 'error',
      message: 'Unable to delete Dashboards Models changes!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to remove Dashboards Models changes',
      ...CONFIGURATION_FAILURE
    },
  }
};
