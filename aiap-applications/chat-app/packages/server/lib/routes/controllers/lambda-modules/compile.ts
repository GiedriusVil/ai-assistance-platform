/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'vba-chat-app-server-controllers-lambda-module-compile';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from 'lodash';

import {
    transformToAcaErrorFormat,
} from '@ibm-aca/aca-data-transformer'

import {
  compileOne
} from '@ibm-aca/aca-lambda-modules-executor';

/**
 * Function provides possibility to check if Javascript snippet, provided ad lambda module, compiles
 * @param {*} request 
 * @param {*} response 
 */
const compile = async (request, response) => {
    const ERRORS = [];
    try {
        const MODULE = request?.body;
        if (lodash.isEmpty(MODULE))  {
            const ACA_ERROR = {
                type: 'VALIDATION_ERROR', 
                message: `[${MODULE_ID}] Missing required request.body attribute!`
            };
    
            throw ACA_ERROR;
        }
        compileOne(MODULE);
    } catch (error) {
        const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
        ERRORS.push(ACA_ERROR);
    }

    if (lodash.isEmpty(ERRORS)) {
        response.status(200).json(true);
    } else {
        logger.error('->', {ERRORS});
        response.status(500).json({errors: ERRORS});
    }
};

export {
    compile,
};
