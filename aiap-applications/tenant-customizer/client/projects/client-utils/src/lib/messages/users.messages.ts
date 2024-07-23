/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Users',
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

export const USERS_MESSAGES = {
  SUCCESS: {
    ADD_USER: {
      ...CONFIGURATION_SUCCESS,
      message: "User profile created!",
    },
    UPDATE_USER: {
      ...CONFIGURATION_SUCCESS,
      message: "User profile updated!",
    },
    DELETE_USER: {
      ...CONFIGURATION_SUCCESS,
      message: "User profile deleted",
    },
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_SUCCESS,
      message: "Reloaded",
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_SUCCESS,
      message: "Removed",
    }
  },
  WARNING: {},
  ERROR: {
    GET_USERS: {
      ...CONFIGURATION_FAILURE,
      message: "Unable to get users!",
    },
    ADD_USER: {
      ...CONFIGURATION_FAILURE,
      message: "Unable create user profile!",
    },
    UPDATE_USER: {
      ...CONFIGURATION_FAILURE,
      message: "Unable update user profile!",
    },
    DELETE_USER: {
      ...CONFIGURATION_FAILURE,
      message: "Unable delete user profile!",
    },
    DELETE_MANY_BY_IDS: {
      ...CONFIGURATION_FAILURE,
      message: "Unable to delete users!",
    },
    FIND_MANY_BY_QUERY: {
      ...CONFIGURATION_FAILURE,
      message: "Unable to reload Users!",
    },
    SHOW_DELETE_MODAL: {
      ...CONFIGURATION_FAILURE,
      message: "Unable to show delete modal!",
    }
  }
};

export const USERS_NOTIFICATION = USERS_MESSAGES;