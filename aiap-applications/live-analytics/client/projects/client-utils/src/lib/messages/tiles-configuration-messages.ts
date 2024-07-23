/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Tiles',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  duration: 4000
}

export const TILES_CONFIGURATION_MESSAGES = {
  SUCCESS: {
    SAVE_ONE: {
      type: 'success',
      message: 'Tile saved!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_ONE_BY_ID: {
      type: 'success',
      message: 'Tile loaded!',
      ...CONFIGURATION_SUCCESS
    },
    FIND_MANY_BY_QUERY: {
      type: 'success',
      message: 'Tile refreshed!',
      ...CONFIGURATION_SUCCESS
    },
    COMPILE: {
      type: 'success',
      message: 'Tile compiled!',
      ...CONFIGURATION_SUCCESS
    },
    IMPORT: {
      type: 'success',
      message: 'Tiles imported!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_IDS: {
      type: 'success',
      message: 'Tiles removed!',
      ...CONFIGURATION_SUCCESS
    },
    DELETE_MANY_BY_QUERY: {
      type: 'success',
      message: 'Tiles removed!',
      ...CONFIGURATION_SUCCESS
    },
  },
  WARNING: {},
  ERROR: {
    MISSING_MANY: {
      type: 'error',
      message: 'Please select Tiles!',
      ...CONFIGURATION_FAILURE
    },
    SAVE_ONE: {
      type: 'error',
      message: 'Unable to save Tile!',
      ...CONFIGURATION_FAILURE
    },
    FIND_ONE_BY_ID: {
      type: 'error',
      message: 'Unable to retrieve Tile!',
      ...CONFIGURATION_FAILURE
    },
    FIND_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to refresh Tiles!',
      ...CONFIGURATION_SUCCESS
    },
    COMPILE: {
      type: 'error',
      message: 'Unable to compile!',
      ...CONFIGURATION_FAILURE
    },
    IMPORT: {
      type: 'error',
      message: 'Unable to import Tiles!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_IDS: {
      type: 'error',
      message: 'Unable to delete Tiles!',
      ...CONFIGURATION_FAILURE
    },
    DELETE_MANY_BY_QUERY: {
      type: 'error',
      message: 'Unable to remove Tiles',
      ...CONFIGURATION_FAILURE
    },
  }
};
