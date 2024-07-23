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
    duration: 2000
}

const CONFIGURATION_FAILURE = {
    ...CONFIG,
    duration: 4000
}

export const TRANSCRIPTS_MESSAGES = {
    SUCCESS: {
        MASK_MESSAGE: {
            type: "success",
            message: 'Successfully masked message!',
            ...CONFIGURATION_SUCCESS
        },
        MARKED_UTTERANCE_FALSE_POSITIVE_FLAG: {
            type: "success",
            message: 'Successfully changed utterance false positive flag!',
            ...CONFIGURATION_SUCCESS
        }
    },
    WARNING: {},
    ERROR: {
        MASK_MESSAGE: {
            type: "error",
            message: 'Failed to mask transcript message!',
            ...CONFIGURATION_FAILURE
        },
        UNABLE_TO_MARK_FALSE_POSITIVE: {
            type: "error",
            message: 'Unable to change status of TOP intent!',
            ...CONFIGURATION_FAILURE
        }
    }
};