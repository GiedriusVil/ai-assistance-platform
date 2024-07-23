/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-services-compile-lambda-module';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from 'lodash';
import jshint from 'jshint';
import requireFromString from 'require-from-string';

import {
    transformToAcaErrorFormat,
} from '@ibm-aca/aca-data-transformer';

/**
 * Function provides possibility to check if Javascript snippet, provided ad lambda module, compiles
 * @param {*} request 
 * @param {*} response 
 */
const compileLambdaModule = (module) => {

    const CODE = module?.code;
    if (lodash.isEmpty(CODE)) {
        const ACA_ERROR = {
            type: 'VALIDATION_ERROR', 
            message: `[${MODULE_ID}] Missing required module.code attribute!`
        };

        throw ACA_ERROR;
    }

    /*
     * Linting
     */
    const DECODED_CODE = Buffer.from(CODE, 'base64').toString('utf-8');
    jshint.JSHINT(DECODED_CODE, {
        esversion: 6
    });
    const LINT_ERRORS = jshint.JSHINT.data().errors.map(e => {
        return {
            line: e.line,
            character: e.character,
            message: e.raw,
            severity: e.code
        }
    });

    if (!lodash.isEmpty(LINT_ERRORS)) {
        for (let index = 0; index < LINT_ERRORS.length; index++) {
            let error = LINT_ERRORS[index];
            if (!lodash.isEmpty(error) && 
                !lodash.isEmpty(error.severity) &&
                error.severity.startsWith('E')) {
                const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, 
                    'Failed to lint code snippet');
                logger.error('->', { ACA_ERROR, LINT_ERRORS });

                /*
                 * Uncomment this to display linting errors on UI
                 */
                // throw ACA_ERROR;
            }
        }
    }

    /*
     * Checking if dependecies are alright
     */
    requireFromString(DECODED_CODE);
};

export {
    compileLambdaModule,
};
