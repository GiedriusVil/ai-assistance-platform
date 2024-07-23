/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'vba-soe-custom-gateway-lambda-module-compilation';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { compileOne } = require('@ibm-aca/aca-lambda-modules-executor');

/**
 * Function provides possibility to check if Javascript snippet, provided ad lambda module, compiles
 * @param {*} request 
 * @param {*} response 
 */
const compile = async (request, response) => {
    let ERROR;
    try {
        const MODULE = ramda.path(['body'], request);
        if (lodash.isEmpty(MODULE))  {
            const ACA_ERROR = {
                type: 'VALIDATION_ERROR', 
                message: `[${MODULE_ID}] Missing required request.body attribute!`
            };
    
            throw ACA_ERROR;
        }
       await compileOne(MODULE);
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        ERROR = ACA_ERROR;
    }

    if (lodash.isEmpty(ERROR)) {
        response.status(200).json(true);
    } else {
        logger.error('->', { ERROR });
        response.status(200).json( ERROR );
    }
};

module.exports = {
    compile,
};
