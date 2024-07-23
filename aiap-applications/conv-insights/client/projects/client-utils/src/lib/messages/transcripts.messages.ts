/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
  target: ".notification-container",
  title: 'Transcripts',
};

const CONFIGURATION_SUCCESS = {
  ...CONFIG,
  type: "success",
  duration: 2000
}

const CONFIGURATION_FAILURE = {
  ...CONFIG,
  type: "error",
  duration: 4000
}

export const TRANSCRIPTS_MESSAGES = {
  SUCCESS: {
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_SUCCESS,
      message: 'Conversation transcript loaded!',
    },
    MASK_MESSAGE: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully masked message!',
    },
    MARKED_UTTERANCE_FALSE_POSITIVE_FLAG: {
      ...CONFIGURATION_SUCCESS,
      message: 'Successfully changed utterance false positive flag!',
    }
  },
  WARNING: {},
  ERROR: {
    MASK_MESSAGE: {
      ...CONFIGURATION_FAILURE,
      message: 'Failed to mask transcript message!',
    },
    UNABLE_TO_MARK_FALSE_POSITIVE: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to change status of TOP intent!',
    },
    FIND_ONE_BY_ID: {
      ...CONFIGURATION_FAILURE,
      message: 'Unable to load conversation transcript!',
    },
  }
};
