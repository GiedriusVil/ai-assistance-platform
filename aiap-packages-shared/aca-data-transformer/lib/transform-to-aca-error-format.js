/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('lodash');

const transformToAcaErrorFormat = (source, error) => {
    let acaError;
    if (
        lodash.isError(error)
    ) {
        acaError = {
            type: 'SYSTEM_ERROR', 
            message: `[${source}] ${error}`
        }
        return acaError;
    }
    if (
        lodash.isEmpty(error)
    ) {
        acaError = {
            type: 'UNDEFINED_ERROR', 
            message: `[${source}] ${error}`
        }
        return acaError;
    }
    if (
        lodash.isString(error)
    ) {
        acaError = {
            type: 'SYSTEM_ERROR', 
            message: `[${source}] ${error}`
        }
        return acaError;
    } 
    acaError = error;
    return acaError;
}


module.exports = {
    transformToAcaErrorFormat
}
