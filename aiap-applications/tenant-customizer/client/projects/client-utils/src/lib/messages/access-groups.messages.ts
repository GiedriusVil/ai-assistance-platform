/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
    target: ".notification-container",
    title: 'Access groups',
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

export const ACCESS_GROUPS_MESSAGES = {
    SUCCESS: {
        FIND_MANY_BY_QUERY: {
            ...CONFIGURATION_SUCCESS,
            message: 'Refreshed',
        },
        IMPORT_MANY_BY_QUERY: {
            ...CONFIGURATION_SUCCESS,
            message: 'Imported',
        },
        DELETE_MANY_BY_IDS: {
            ...CONFIGURATION_SUCCESS,
            message: 'Access Groups removed!',
        }
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
        IMPORT_MANY_BY_QUERY: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to import!',
        },
        DELETE_MANY_BY_IDS: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to remove Access Groups',
        },
        SHOW_ACCESS_GROUP_DELETE_MODAL: {
            type: 'error',
            message: 'Unable to show Access Group delete modal',
            ...CONFIGURATION_FAILURE
        },
    }
};