/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
    target: ".notification-container",
    title: 'Classifier',
};

const CONFIGURATION_SUCCESS = {
    ...CONFIG,
    duration: 2000
};

const CONFIGURATION_FAILURE = {
    ...CONFIG,
    duration: 4000
};

export const CLASSIFIER_MESSAGES = {
    SUCCESS: {
        FIND_MANY_BY_QUERY: {
            type: 'success',
            message: 'Refreshed classifier models',
            ...CONFIGURATION_SUCCESS
        },
        SAVE_ONE: {
            type: 'success',
            message: 'Classifier model saved!',
            ...CONFIGURATION_SUCCESS
        },
        DELETE_MANY_BY_QUERY: {
            type: 'success',
            message: 'Classifier models removed!',
            ...CONFIGURATION_SUCCESS
        },
        TRAIN_ONE_BY_ID: {
            type: 'success',
            message: 'Classifier model is being trained!',
            ...CONFIGURATION_SUCCESS
        },
        TEST_ONE_BY_ID: {
            type: 'success',
            message: 'Executed!',
            ...CONFIGURATION_SUCCESS
        },
        IMPORT_MANY_FROM_FILE: {
            type: 'success',
            message: 'Classifier models Imported!',
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
        FIND_MANY_BY_QUERY: {
            type: 'error',
            message: 'Unable to refresh Classifier Models',
            ...CONFIGURATION_FAILURE
        },
        FIND_ONE_BY_ID: {
            type: 'error',
            message: 'Unable to find model',
            ...CONFIGURATION_FAILURE
        },
        SAVE_ONE: {
            type: 'error',
            message: 'Unable to save model',
            ...CONFIGURATION_FAILURE
        },
        DELETE_MANY_BY_QUERY: {
            type: 'error',
            message: 'Unable to remove models',
            ...CONFIGURATION_FAILURE
        },
        TRAIN_ONE_BY_ID: {
            type: 'error',
            message: 'Unable to train model!',
            ...CONFIGURATION_FAILURE
        },
        TEST_ONE_BY_ID: {
            type: 'error',
            message: 'Unable to test model!',
            ...CONFIGURATION_FAILURE
        },
        SHOW_CLASSIFIER_MODEL_DELETE_MODAL: {
            type: 'error',
            message: 'Unable to show Classifier Model Delete Modal',
            ...CONFIGURATION_FAILURE
        },
        SHOW_CLASSIFIER_MODEL_TRAIN_MODAL: {
            type: 'error',
            message: 'Unable to show Classifier Model Train Modal',
            ...CONFIGURATION_FAILURE
        },
        SHOW_CLASSIFIER_MODEL_TEST_MODAL: {
            type: 'error',
            message: 'Unable to show Classifier Model Test Modal',
            ...CONFIGURATION_FAILURE
        },
        NO_ACCESS_GROUPS: {
            type: 'error',
            message: 'Unable to retrieve access groups!',
            ...CONFIGURATION_FAILURE
        },
        IMPORT_MANY_FROM_FILE: {
            type: 'error',
            message: 'Unable to  import Classifier Models',
            ...CONFIGURATION_SUCCESS
        }
    }
};
