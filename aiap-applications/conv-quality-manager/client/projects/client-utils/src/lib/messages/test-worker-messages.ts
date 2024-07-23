/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

const CONFIG = {
   target: ".notification-container",
   title: 'Workers',
};

const CONFIGURATION_SUCCESS = {
   ...CONFIG,
   duration: 2000
}

const CONFIGURATION_FAILURE = {
   ...CONFIG,
   duration: 4000
}

export const TEST_WORKER_MESSAGES = {
   SUCCESS: {
      FIND_MANY_BY_QUERY: {
         type: 'success',
         message: 'Refreshed!',
         ...CONFIGURATION_SUCCESS,
      },
      SAVE_ONE: {
         type: 'success',
         message: 'Saved!',
         ...CONFIGURATION_SUCCESS,
      },
      DELETE_MANY_BY_IDS: {
         type: 'success',
         message: 'Removed!',
         ...CONFIGURATION_SUCCESS,
      }
   },
   WARNING: {},
   ERROR: {
      FIND_MANY_BY_QUERY: {
         type: 'error',
         message: 'Unable to refresh!',
         ...CONFIGURATION_FAILURE
      },
      SAVE_ONE: {
         type: 'error',
         message: 'Unable to save!',
         ...CONFIGURATION_FAILURE
      },
      RETRIEVE_FORM_DATA: {
         type: 'error',
         message: 'Unable to retrieve data!',
         ...CONFIGURATION_FAILURE
      },
      MISSING_IDS_SELECTION: {
         type: 'error',
         message: 'Please select workers!',
         ...CONFIGURATION_FAILURE
      },
      DELETE_MANY_BY_IDS: {
         type: 'error',
         message: 'Unable to remove!',
         ...CONFIGURATION_FAILURE,
      }
   }
};