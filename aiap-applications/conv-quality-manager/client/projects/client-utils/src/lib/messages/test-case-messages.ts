/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Test cases',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  duration: 4000
}

export const TEST_CASE_MESSAGES = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      type: 'success',
      message: 'Refreshed!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_IDS: {
      type: 'success',
      message: 'Removed!',
      ...CONFIGURATION_SUCCESS
    },
    SAVE_ONE: {
      type: 'success',
      message: 'Saved!',
      ...CONFIGURATION_SUCCESS
    },
    LOAD_FORM_DATA: {
      type: 'success',
      message: 'Form data loaded!',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT_TEST_CASES: {
      type: 'success',
      message: 'Test cases were imported!',
      ...CONFIGURATION_SUCCESS
    }
  },
  WARNING: {},
  ERROR: {
    FIND_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to refresh!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_IDS: {
      type: 'error',
      message: 'Unable to remove!',
      ...CONFIGURATION_FAILURE
    },
    MISSING_IDS_SELECTION: {
      type: 'error',
      message: 'Please select test cases!',
      ...CONFIGURATION_FAILURE
    },
    SAVE_ONE: {
      type: 'error',
      message: 'Unable to save!',
      ...CONFIGURATION_FAILURE
    },
    LOAD_FORM_DATA: {
      type: 'error',
      message: 'Unable to load form data!',
      ...CONFIGURATION_FAILURE
    },
    IMPORT_TEST_CASES: {
      type: 'error',
      message: 'Unable to import test cases!',
      ...CONFIGURATION_SUCCESS
    }
  }
};
