/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

const CONFIG = {
  target: ".notification-container",
  title: 'Utterances',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  type: 'success',
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  type: 'error',
  duration: 4000
}

export const UTTERANCES_MESSAGES = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      message: 'Refreshed!',
      ...CONFIGURATION_SUCCESS
    },
  },
  WARNING: {},
  ERROR: {
    FIND_MANY_BY_QUERY: {
      message: 'Unable to refresh!',
      ...CONFIGURATION_FAILURE
    },
    GET_METRICS: {
      message: 'Unable to get metrics!',
      ...CONFIGURATION_FAILURE
    },
    GET_TOP_INTENTS: {
      message: 'Unable to get top intents!',
      ...CONFIGURATION_FAILURE
    },
  }
};
