/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const CONFIGURATION = {
    target: ".notification-container",
    title: 'Catalog Rules',
};

const CONFIGURATION_SUCCESS = {
    ...CONFIGURATION,
    type: 'success',
    duration: 2000,
}

const CONFIGURATION_WARNING = {
    ...CONFIGURATION,
    type: 'warning',
    duration: 2000,
}

const CONFIGURATION_FAILURE = {
    ...CONFIGURATION,
    type: 'error',
    duration: 4000,
}

export const CATALOG_RULES_MESSAGES = {
    SUCCESS: {
        FIND_MANY_BY_QUERY: {
            ...CONFIGURATION_SUCCESS,
            message: 'Refreshed',
        },
        LOAD_SAVE_MODAL_DATA: {
            ...CONFIGURATION_SUCCESS,
            message: 'Refreshed',
        },
        DELETE_MANY_BY_IDS: {
            ...CONFIGURATION_SUCCESS,
            message: 'Removed',
        },
        SAVE_ONE: {
            ...CONFIGURATION_SUCCESS,
            message: 'Saved',
        },
        EXPORT_MANY: {
            ...CONFIGURATION_SUCCESS,
            message: 'Exported',
        }
    },
    WARNING: {
        EXAMPLE: {
            ...CONFIGURATION_WARNING,
            message: 'EXAMPLE',
        }
    },
    ERROR: {
        FIND_MANY_BY_QUERY: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to refresh!',
        },
        LOAD_SAVE_MODAL_DATA: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to load!',
        },
        DELETE_MANY_BY_IDS: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to remove!',
        },
        SAVE_ONE: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to save!',
        },
        EXPORT_MANY: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to export',
        },
        SHOW_CATALOG_RULE_SAVE_MODAL: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to show Catalog Rule save modal',
        },
    }
};