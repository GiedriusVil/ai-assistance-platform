/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

const CONFIG = {
    target: ".notification-container",
    title: 'Classification categories',
};

const CONFIGURATION_SUCCESS = {
    ...CONFIG,
    duration: 2000
}

const CONFIGURATION_FAILURE = {
    ...CONFIG,
    duration: 4000
}

export const CLASSIFICATION_CATEGORIES_MESSAGES = {
    SUCCESS: {
        SAVE_CLASSIFICATION_CATEGORY: {
            ...CONFIGURATION_SUCCESS,
            type: 'success',
            message: 'Successfully saved classification catalog category!',
        },
        DELETE_ONE: {
            ...CONFIGURATION_SUCCESS,
            type: 'success',
            message: 'Category has been removed!',

        },
        IMPORT_ONE_BY_FILE: {
            ...CONFIGURATION_SUCCESS,
            type: 'success',
            message: 'Imported!',
        },
        FIND_MANY_BY_QUERY: (type: string) => {
            const RET_VAL = {
                type: 'success',
                message: 'Classification categories were refreshed!',
                ...CONFIGURATION_SUCCESS
            };
            if (
                lodash.isString(type) &&
                !lodash.isEmpty(type)
            ) {
                switch (type) {
                    case 'SEGMENT':
                        RET_VAL.message = `Segments have been refreshed!`
                        break;
                    case 'FAMILY':
                        RET_VAL.message = `Families have been refreshed!`
                        break;
                    case 'CLASS':
                        RET_VAL.message = `Classes have been refreshed!`
                        break;
                    case 'SUB_CLASS':
                        RET_VAL.message = `Sub-Classes have been refreshed!`
                        break;
                    default:
                        break;
                }
            }
            return RET_VAL;
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
        SAVE_CLASSIFICATION_CATEGORY: {
            ...CONFIGURATION_FAILURE,
            type: 'error',
            message: 'Unable to save classification catalog category!',
        },
        DELETE_ONE: {
            ...CONFIGURATION_FAILURE,
            type: 'error',
            message: 'Unable to delete category!',
        },
        IMPORT_ONE_BY_FILE: {
            ...CONFIGURATION_FAILURE,
            type: 'error',
            message: 'Unable to import!',
        },
        FIND_MANY_BY_QUERY: (type: string) => {
            const RET_VAL = {
                type: 'error',
                message: 'Unable to refresh classification categories!',
                ...CONFIGURATION_FAILURE
            };
            if (
                lodash.isString(type) &&
                !lodash.isEmpty(type)
            ) {
                switch (type) {
                    case 'SEGMENT':
                        RET_VAL.message = `Unable to refresh segments!`
                        break;
                    case 'FAMILY':
                        RET_VAL.message = `Unable to refresh families!`
                        break;
                    case 'CLASS':
                        RET_VAL.message = `Unable to refresh classes!!`
                        break;
                    case 'SUB_CLASS':
                        RET_VAL.message = `Unable to refresh sub-classes!`
                        break;
                    default:
                        break;
                }
            }
            return RET_VAL;
        },
    }
};