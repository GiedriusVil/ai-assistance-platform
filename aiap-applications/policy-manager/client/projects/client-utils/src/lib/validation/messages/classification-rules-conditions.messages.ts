/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Classification Rules Conditions',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  type: 'success',
  duration: 2000,
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  type: 'error',
  duration: 4000,
}

export const CLASSIFICATION_RULES_CONDITIONS_MESSAGES = {
  SUCCESS: {
      FIND_MANY_BY_QUERY: {
          ...CONFIGURATION_SUCCESS,
          message: 'Refreshed',
      },
      LOAD_SAVE_MODAL_DATA: {
          ...CONFIGURATION_SUCCESS,
          message: 'Refreshed',
      },
      DELETE_MANY_BY_IDS: {
          ...CONFIGURATION_SUCCESS,
          message: 'Removed',
      },
      SAVE_ONE: {
          ...CONFIGURATION_SUCCESS,
          message: 'Saved',
      }
  },
  ERROR: {
      FIND_MANY_BY_QUERY: {
          ...CONFIGURATION_FAILURE,
          message: 'Unable to refresh!',
      },
      LOAD_SAVE_MODAL_DATA: {
          ...CONFIGURATION_FAILURE,
          message: 'Unable to load!',
      },
      DELETE_MANY_BY_IDS: {
          ...CONFIGURATION_FAILURE,
          message: 'Unable to remove!',
      },
      SAVE_ONE: {
          ...CONFIGURATION_FAILURE,
          message: 'Unable to save!',
      },
      SHOW_CLASSIFICATION_RULE_CONDITION_SAVE_MODAL: {
          ...CONFIGURATION_FAILURE,
          type: 'error',
          message: 'Unable to show Classification Rules Condition save modal',
      },
  }
};