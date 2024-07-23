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

export const TENANTS_MESSAGES = {
    SUCCESS: {
        RETRIEVE_API_KEY: {
            type: 'success',
            message: 'Tenant ApiKey refreshed',
            ...CONFIGURATION_SUCCESS
        },
        FIND_ONE_BY_ID: {
            type: 'success',
            message: 'Tenant data was loaded!',
            ...CONFIGURATION_SUCCESS
        },
        FETCH_TENANT_SELECTIONS: {
            type: 'success',
            message: 'Tenant selections refreshed',
            ...CONFIGURATION_SUCCESS
        },
        SAVE_ONE: {
            type: 'success',
            message: 'Tenant was saved',
            ...CONFIGURATION_SUCCESS
        },
        TEST_REDIS_CONNECTION: {
            type: 'success',
            message: 'Tenant redis client connection was successfull!',
            ...CONFIGURATION_SUCCESS
        },
        TEST_MONGO_CONNECTION: {
            type: 'success',
            message: 'Tenant mongo client connection was successfull!',
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
        RETRIEVE_API_KEY: {
            type: 'error',
            message: 'Unable to refresh tenant ApiKey',
            ...CONFIGURATION_FAILURE
        },
        FIND_ONE_BY_ID: {
            type: 'error',
            message: 'Unable to load tenant data!',
            ...CONFIGURATION_SUCCESS
        },
        FETCH_TENANT_SELECTIONS: {
            type: 'error',
            message: 'Unable to refresh tenant selections',
            ...CONFIGURATION_FAILURE
        },
        SAVE_ONE: {
            type: 'error',
            message: 'Unable to save error',
            ...CONFIGURATION_FAILURE
        },
        TEST_REDIS_CONNECTION: {
            type: 'error',
            message: 'Tenant redis client connection has failed!',
            ...CONFIGURATION_FAILURE
        },
        TEST_MONGO_CONNECTION: {
            type: 'error',
            message: 'Tenant mongo client connection has failed!',
            ...CONFIGURATION_FAILURE
        },
    }
};