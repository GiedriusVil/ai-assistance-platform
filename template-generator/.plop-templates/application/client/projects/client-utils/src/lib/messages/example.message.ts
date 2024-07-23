/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
    target: ".notification-container",
    title: 'Example',
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

export const EXAMPLE_MESSAGES = {
    SUCCESS: {
        EXAMPLE: {
            type: 'success',
            message: 'Example success!',
            ...CONFIGURATION_SUCCESS
        }
    },
    WARNING: {
        EXAMPLE: {
            type: 'warning',
            message: 'Example warning!',
            ...CONFIG
        }
    },
    ERROR: {
        EXAMPLE: {
            type: 'error',
            message: 'Example failure!',
            ...CONFIGURATION_FAILURE
        }
    }
};
