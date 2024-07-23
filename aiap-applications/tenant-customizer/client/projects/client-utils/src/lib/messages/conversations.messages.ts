/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
    target: ".notification-container",
    title: 'Conversations',
    duration: 4000
};
  
export const CONVERSATIONS_MESSAGES = {
    SUCCESS: {
        FIND_MANY_BY_QUERY: {
            type: 'success',
            message: 'Reloaded conversations',
            ...CONFIG
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
            message: 'Unable to reload conversations',
            ...CONFIG
        }, 
    }
};  