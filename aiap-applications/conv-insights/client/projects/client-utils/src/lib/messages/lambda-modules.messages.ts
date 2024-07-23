/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

const CONFIG = {
    target: ".notification-container",
    title: 'Λ modules',
};

const CONFIGURATION_SUCCESS = {
    ...CONFIG,
    duration: 2000
}

const CONFIGURATION_FAILURE = {
    ...CONFIG,
    duration: 4000
}

export const LAMBDA_MODULES_MESSAGES = {
    SUCCESS: {
        SAVE_ONE: {
            type: 'success',
            message: 'Module was saved!',
            ...CONFIGURATION_SUCCESS
        },
        FIND_ONE_BY_ID: {
            type: 'success',
            message: 'Module was loaded!',
            ...CONFIGURATION_SUCCESS
        },
        FIND_MANY_BY_QUERY: {
            type: 'success',
            message: 'Refreshed!',
            ...CONFIGURATION_SUCCESS
        },
        COMPILE: {
            type: 'success',
            message: 'Module was compiled!',
            ...CONFIGURATION_SUCCESS
        },
        IMPORT: {
            type: 'success',
            message: 'Modules was imported!',
            ...CONFIGURATION_SUCCESS
        },
        DELETE_MANY_BY_IDS: {
            type: 'success',
            message: 'Modules were removed!',
            ...CONFIGURATION_SUCCESS
        }
    },
    WARNING: {},
    ERROR: {
        MISSING_MANY: {
            type: 'error',
            message: 'Please select modules!',
            ...CONFIGURATION_FAILURE
        }, 
        SAVE_ONE: {
            type: 'error',
            message: 'Unable to module!',
            ...CONFIGURATION_FAILURE
        },
        FIND_ONE_BY_ID: {
            type: 'error',
            message: 'Unable to retrieve module!',
            ...CONFIGURATION_FAILURE
        },
        FIND_MANY_BY_QUERY: {
            type: 'error',
            message: 'Unable to refresh!',
            ...CONFIGURATION_SUCCESS
        },
        COMPILE: {
            type: 'error',
            message: 'Unable to compile!',
            ...CONFIGURATION_FAILURE
        },
        IMPORT: {
            type: 'error',
            message: 'Unable to import modules!',
            ...CONFIGURATION_FAILURE
        },
        DELETE_MANY_BY_IDS: {
            type: 'error',
            message: 'Unable to delete modules!',
            ...CONFIGURATION_FAILURE
        },
    }
};