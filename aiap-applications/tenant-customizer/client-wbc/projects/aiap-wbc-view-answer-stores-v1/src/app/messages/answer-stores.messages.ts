/*
	© Copyright IBM Corporation 2023. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const CONFIG = {
    target: '.notification-container',
    title: 'Answers',
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

export const ANSWER_STORES_MESSAGES = {
    SUCCESS: {
        FIND_MANY_BY_QUERY: {
            ...CONFIGURATION_SUCCESS,
            message: 'Refreshed answer stores!'
        },
        SAVE_ONE: {
            ...CONFIGURATION_SUCCESS,
            message: 'Successfully saved answer store'
        },
        DELETE_ONE: {
            ...CONFIGURATION_SUCCESS,
            message: 'Successfully deleted answer store'
        },
        DELETE_MANY_BY_IDS: {
            ...CONFIGURATION_SUCCESS,
            message: 'Successfully deleted answer stores'
        },
        IMPORT_MANY_FROM_FILE: {
            ...CONFIGURATION_SUCCESS,
            message: 'Imported'
        },
        PULL_MANY_BY_IDS: {
            ...CONFIGURATION_SUCCESS,
            message: 'Pulled!',
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
            message: 'Unable to refresh answer stores'
        },
        SAVE_ONE: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to retrieve answer stores'
        },
        DELETE_ONE: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to delete answer store'
        },
        DELETE_MANY_BY_IDS: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to delete answer stores'
        },
        IMPORT_MANY_FROM_FILE: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to import!'
        },
        LOAD_DATASOURCES: {
          ...CONFIGURATION_FAILURE,
          message: 'Unable to load datasources!'
        },
        PULL_MANY_BY_IDS: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to pull AI Skills!',
        },
        SHOW_PULL_MODAL: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to show pull modal!',
        },
    }
};
