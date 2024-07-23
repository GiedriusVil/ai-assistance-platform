/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Metrics',
};


const CONFIGURATION_FAILURE = {
  ...CONFIG,
  type: 'error',
  duration: 4000,
}

export const METRICS_MESSAGES = {
  SUCCESS: {},
  ERROR: {
      LOAD_DATA: {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to load',
      }
  }
};