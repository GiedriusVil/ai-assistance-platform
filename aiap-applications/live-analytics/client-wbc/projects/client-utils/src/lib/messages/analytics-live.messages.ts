/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const CONFIG = {
    target: ".notification-container",
    title: 'Analytics Live',
    duration: 4000
};
  
export const ANALYTICS_LIVE_MESSAGES = {
    SUCCESS: {
        FIND_METRICS: {
            type: 'success',
            message: 'Metrics were refreshed',
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
        FIND_METRICS: {
            type: 'error',
            message: 'Unable to refresh metrics',
            ...CONFIG
        }, 
    }
};  