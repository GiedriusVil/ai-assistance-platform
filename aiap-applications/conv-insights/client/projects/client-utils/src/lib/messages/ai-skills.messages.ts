/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
    target: ".notification-container",
    title: 'AI Skills',
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

export const AI_SKILLS_MESSAGES = {
    SUCCESS: {
        FIND_MANY_BY_QUERY: {
            ...CONFIGURATION_SUCCESS,
            message: 'Refreshed',
        },
        REFRESH_ONE_BY_ID: {
            ...CONFIGURATION_SUCCESS,
            message: 'Refreshed',
        },
        DELETE_MANY_BY_IDS: {
            ...CONFIGURATION_SUCCESS,
            message: 'Removed!',
        },
        ROLLBACK_ONE_BY_ID: {
            ...CONFIGURATION_SUCCESS,
            title: "Assign version wa skill",
            message: "Successfully assign version to watson assistant skill!",
        },
        PULL_MANY_BY_IDS: {
            ...CONFIGURATION_SUCCESS,
            message: 'Pulled!',
        },
        SYNC_MANY_BY_IDS: {
            ...CONFIGURATION_SUCCESS,
            message: 'Synchronized!',
        },
        SYNC_MANY_BY_FILES: {
            ...CONFIGURATION_SUCCESS,
            message: 'Synchronized!',
        },
        COLLECT_MANAGE_ONE_MODAL_DATA: {
            ...CONFIGURATION_SUCCESS,
            message: 'Loaded!',
        },
    },
    WARNING: {},
    ERROR: {
        FIND_MANY_BY_QUERY: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to refresh',
        },
        REFRESH_ONE_BY_ID: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to refresh',
        },
        DELETE_MANY_BY_IDS: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to remove!',
        },
        ROLLBACK_ONE_BY_ID: {
            ...CONFIGURATION_FAILURE,
            title: "Unable to assign AI Skill version!",
        },
        SYNC_MANY_BY_IDS: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to synchorize AI Skills!',
        },
        SYNC_MANY_BY_FILES: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to synchorize AI Skills by provissioned files!',
        },
        PULL_MANY_BY_IDS: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to pull AI Skills!',
        },
        COLLECT_MANAGE_ONE_MODAL_DATA: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to collect AI Skill data!',
        },
        SHOW_AI_SKILL_DELETE_MODAL: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to show delete modal!',
        },
        SHOW_AI_SKILL_ROLLBACK_MODAL: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to show rollback modal!',
        },
        SHOW_SYNC_MODAL: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to show sync modal!',
        },
        SHOW_PULL_MODAL: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to show pull modal!',
        },
        SHOW_MANAGE_MODAL: {
            ...CONFIGURATION_FAILURE,
            message: 'Unable to show manage modal!',
        }
    }
};  