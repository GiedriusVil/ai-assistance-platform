/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

const CONFIG = {
    target: ".notification-container",
    title: 'Applications',
};

const CONFIGURATION_SUCCESS = {
    ...CONFIG,
    duration: 2000
}

const CONFIGURATION_FAILURE = {
    ...CONFIG,
    duration: 4000
}

export const APPLICATIONS_MESSAGES = {
    SUCCESS: {
        SAVE_ONE: {
            type: 'success',
            message: 'Saved',
            ...CONFIGURATION_SUCCESS
        },
        FIND_MANY_BY_QUERY: {
            type: 'success',
            message: 'Refreshed',
            ...CONFIGURATION_SUCCESS
        },
        IMPORT_MANY_FROM_FILE: {
            type: 'success',
            message: 'Imported',
            ...CONFIGURATION_SUCCESS
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
        SAVE_ONE: {
            type: 'success',
            message: 'Unable to save!',
            ...CONFIGURATION_SUCCESS
        },
        FIND_MANY_BY_QUERY: {
            type: 'error',
            message: 'Unable to refresh!',
            ...CONFIGURATION_FAILURE
        },
        IMPORT_MANY_FROM_FILE: {
            type: 'error',
            message: 'Unable to import!',
            ...CONFIGURATION_FAILURE
        },
    }
};