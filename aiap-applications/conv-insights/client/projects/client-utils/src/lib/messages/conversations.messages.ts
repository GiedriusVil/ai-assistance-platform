/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Conversations',
  duration: 10000
};

const CONFIG_SUCCESS = {
  ...CONFIG,
  type: 'success',
}

const CONFIG_WARNING = {
  ...CONFIG,
  type: 'warning',
}

const CONFIG_ERROR = {
  ...CONFIG,
  type: 'error',
}

export const CONVERSATIONS_MESSAGES = {
  SUCCESS: {
    FIND_MANY_BY_QUERY: {
      ...CONFIG_SUCCESS,
      message: 'Reloaded conversations',
    },
    ADD_REVIEW: {
      ...CONFIG_SUCCESS,
      message: 'Review added to conversation'
    },
    REMOVE_REVIEW: {
      ...CONFIG_SUCCESS,
      message: 'Review removed from conversation'
    },
    SAVE_TAGS: {
      ...CONFIG_SUCCESS,
      message: 'Tags added to conversation'
    },
    REMOVE_TAGS: {
      ...CONFIG_SUCCESS,
      message: 'Tags removed to conversation'
    }
  },
  WARNING: {
    EXAMPLE: {
      ...CONFIG_WARNING,
      message: 'EXAMPLE',
    }
  },
  ERROR: {
    FIND_MANY_BY_QUERY: {
      ...CONFIG_ERROR,
      message: 'Unable to reload conversations!',
    },
    ADD_REVIEW: {
      ...CONFIG_ERROR,
      message: 'Unable to add review to conversation!'
    },
    REMOVE_REVIEW: {
      ...CONFIG_ERROR,
      message: 'Unable to remove review from conversation'
    },
    SAVE_TAGS: {
      ...CONFIG_SUCCESS,
      message: 'Unable to add tag to conversation'
    },
    REMOVE_TAGS: {
      ...CONFIG_SUCCESS,
      message: 'Unable to remove tag from conversation'
    }
  }
};  
