/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-lambda-modules-executor-utils-construct-module-runtime-id`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const constructModuleRuntimeIdByIdAndTenant = (params) => {
    try {
        const TENANT_ID = ramda.path(['tenant', 'id'], params);
        const LAMBDA_MODULE_ID = ramda.path(['id'], params);
        if (
            lodash.isEmpty(LAMBDA_MODULE_ID)
        ) {
            const MESSAGE = 'Missing required params.id parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (
            lodash.isEmpty(TENANT_ID)
        ) {
            const MESSAGE = 'Missing required params.tenant.id parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const RET_VAL = `${TENANT_ID}:${LAMBDA_MODULE_ID}`
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    constructModuleRuntimeIdByIdAndTenant,
}
