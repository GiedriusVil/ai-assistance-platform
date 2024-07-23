/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
    target: ".notification-container",
    title: 'AI Skills Releases',
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

export const AI_SKILL_RELEASES_MESSAGES = {
    SUCCESS: {
        FIND_MANY_BY_QUERY: {
            ...CONFIGURATION_SUCCESS,
            message: 'Refreshed',
        },
        FIND_ONE_BY_ID: {
            ...CONFIGURATION_SUCCESS,
            message: 'Refreshed',
        },
        DEPLOY_ONE: {
            ...CONFIGURATION_SUCCESS,
            message: 'Deployed',
        },
        DELETE_MANY_BY_IDS: {
            ...CONFIGURATION_SUCCESS,
            message: 'Deleted',
        },
    },
    WARNING: {},
    ERROR: {
        FIND_MANY_BY_QUERY: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to find AI Skill releases!',
        },
        FIND_ONE_BY_ID: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to find AI Skill release!',
        },
        DEPLOY_ONE: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to deploy AI Skill release!',
        },
        DELETE_MANY_BY_IDS: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to delete AI Skill releases!',
        },
        SHOW_DEPLOY_MODAL: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to show deploy modal!',
        },
        SHOW_DELETE_MODAL: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to show delete modal!',
        },
    }
};  