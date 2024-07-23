/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Classification Rules External Classifications',
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

export const CLASSIFICATION_RULES_EXTERNAL_CLASSIFICATIONS_MESSAGES = {
  ERROR: {
      FIND_MANY_SEGMENTS_BY_QUERY: {
          ...CONFIGURATION_FAILURE,
          message: 'Unable to fetch segments!',
      },
      FIND_MANY_FAMILIES_BY_QUERY: {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to fetch families!',
      },
      FIND_MANY_CLASSES_BY_QUERY: {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to fetch classes!',
      },
      FIND_MANY_COMMODITIES_BY_QUERY: {
        ...CONFIGURATION_FAILURE,
        message: 'Unable to fetch commodities!',
      },
  }
};