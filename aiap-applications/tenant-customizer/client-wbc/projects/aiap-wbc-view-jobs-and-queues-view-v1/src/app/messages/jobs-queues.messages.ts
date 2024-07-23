/*
	© Copyright IBM Corporation 2023. All Rights Reserved

	SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

const CONFIG = {
    target: ".notification-container",
    title: 'Jobs and Queues',
};

const CONFIGURATION_SUCCESS = {
    ...CONFIG,
    duration: 2000
};

const CONFIGURATION_FAILURE = {
    ...CONFIG,
    duration: 4000
};

export const JOBS_QUEUES_MESSAGES = {
    SUCCESS: {
        FIND_MANY_BY_QUERY: {
            type: 'success',
            message: 'Refreshed queues',
            ...CONFIGURATION_SUCCESS
        },
        SAVE_ONE: {
            type: 'success',
            message: 'Queue saved!',
            ...CONFIGURATION_SUCCESS
        },
        DELETE_MANY_BY_QUERY: {
            type: 'success',
            message: 'Queue removed!',
            ...CONFIGURATION_SUCCESS
        },
        IMPORT: {
            type: 'success',
            message: 'Queues was imported!',
            ...CONFIGURATION_SUCCESS
        }
    },
    ERROR: {
        FIND_MANY_BY_QUERY: {
            type: 'error',
            message: 'Unable to refresh queues',
            ...CONFIGURATION_FAILURE
        },
        SAVE_ONE: {
            type: 'error',
            message: 'Unable to save queue',
            ...CONFIGURATION_FAILURE
        },
        DELETE_MANY_BY_QUERY: {
            type: 'error',
            message: 'Unable to remove queues',
            ...CONFIGURATION_FAILURE
        },
        NO_ACCESS_GROUPS: {
            type: 'error',
            message: 'Unable to retrieve access groups!',
            ...CONFIGURATION_FAILURE
        },
        IMPORT: {
            type: 'error',
            message: 'Unable to import queues!',
            ...CONFIGURATION_FAILURE
        }
    }
};
