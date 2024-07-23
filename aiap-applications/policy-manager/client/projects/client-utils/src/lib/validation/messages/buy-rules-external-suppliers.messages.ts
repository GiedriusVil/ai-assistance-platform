/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Buy Rules External Suppliers',
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

export const BUY_RULES_EXTERNAL_SUPPLIERS_MESSAGES = {
  SUCCESS: {
      FIND_MANY_BY_QUERY: {
          ...CONFIGURATION_SUCCESS,
          message: 'Refreshed',
      },
  },
  WARNING: {
      EXAMPLE: {
          type: 'warning',
          message: 'EXAMPLE',
          ...CONFIG
      }
  },
  ERROR: {
      FIND_MANY_BY_QUERY: {
          ...CONFIGURATION_FAILURE,
          message: 'Unable to refresh!',
      },
  }
};