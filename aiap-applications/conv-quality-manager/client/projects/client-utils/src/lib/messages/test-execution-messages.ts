/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

const CONFIG = {
   target: ".notification-container",
   title: 'Executions',
};

const CONFIGURATION_SUCCESS = {
   ...CONFIG,
   duration: 2000
}

const CONFIGURATION_FAILURE = {
   ...CONFIG,
   duration: 4000
}

export const TEST_EXECUTION_MESSAGES = {
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
      GENERATE_MANY: {
         type: 'success',
         message: 'Generated!',
         ...CONFIGURATION_SUCCESS
      }
   },
   WARNING: {},
   ERROR: {
      FIND_MANY_BY_QUERY: {
         type: 'error',
         message: 'Unable to refresh',
         ...CONFIGURATION_FAILURE
      },
      RETRIEVE_FORM_DATA: {
         type: 'error',
         message: 'Unable to retrieve form data!',
         ...CONFIGURATION_FAILURE
      },
      DELETE_MANY_BY_IDS: {
         type: 'error',
         message: 'Unable to remove!',
         ...CONFIGURATION_FAILURE
      },
      MISSING_IDS_SELECTION: {
         type: 'error',
         message: 'Please select executions!',
         ...CONFIGURATION_FAILURE
      },
      SAVE_ONE: {
         type: 'error',
         message: 'Unable to save execution!',
         ...CONFIGURATION_FAILURE
      }, 
      GENERATE_MANY: {
         type: 'error',
         message: 'Unable to generate executions!',
         ...CONFIGURATION_FAILURE
      }
   }
};