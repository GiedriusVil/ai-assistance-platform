/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lamdba-modules-executor-executor-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getOneByIdAndTenant } = require('../runtime-storage');

const executeEnrichedByLambdaModule = async (id, origin, context, params) => {
    try {
        const TENANT = ramda.path(['user', 'session', 'tenant'], context);
        const LAMBDA_MODULE = getOneByIdAndTenant({ tenant: TENANT, id: id });

        if (LAMBDA_MODULE) {
            params.config = LAMBDA_MODULE.configuration;
        }
        if (
            LAMBDA_MODULE &&
            LAMBDA_MODULE.preExecute
        ) {
            await LAMBDA_MODULE.preExecute(context, params);
        }
        let retVal;
        if (
            LAMBDA_MODULE &&
            LAMBDA_MODULE.execute
        ) {
            retVal = await LAMBDA_MODULE.execute(context, params);
        } else {
            retVal = await origin(context, params);
        }
        if (
            LAMBDA_MODULE &&
            LAMBDA_MODULE.postExecute
        ) {
            retVal = LAMBDA_MODULE.postExecute(context, params, retVal);
        }
        return retVal;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('executeEnrichedByLambdaModule', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    executeEnrichedByLambdaModule,
}
