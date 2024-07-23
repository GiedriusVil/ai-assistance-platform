/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-lambda-modules-executor-runtime-storage-load-many-by-tenant`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
    getLambdaModulesDatasourceByTenant,
} = require('../utils');

const { loadOneByIdAndTenant } = require('./load-one-by-id-and-tenant');

const loadManyByTenant = async (params) => {
    const TENANT = ramda.path(['tenant'], params);
    const SILENT = ramda.pathOr(false, ['options', 'silent'], params);
    try {
        if (
            lodash.isEmpty(TENANT)
        ) {
            const MESSAGE = 'Missing required params.tenant parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const DATASOURCE = getLambdaModulesDatasourceByTenant(TENANT);
        const PARAMS = {
            sort: {
                field: 'id',
                direction: 'asc'
            }
        };
        const RESPONSE = await DATASOURCE.modules.findManyByQuery({}, PARAMS);
        const LAMBDA_MODULES_DEFS = ramda.path(['items'], RESPONSE);
        let retVal;
        if (
            lodash.isArray(LAMBDA_MODULES_DEFS)
        ) {
            const PROMISES = [];
            for (let lambdaModuleDef of LAMBDA_MODULES_DEFS) {
                let tmpParams = {
                    tenant: TENANT,
                    id: ramda.path(['id'], lambdaModuleDef),
                    options: { silent: SILENT }
                }
                PROMISES.push(loadOneByIdAndTenant(tmpParams));
            }
            retVal = await Promise.all(PROMISES);
        }
        return retVal;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        ACA_ERROR.tenant = {
            id: ramda.path(['id'], TENANT),
            hash: ramda.path(['hash'], TENANT),
        }
        logger.error('->', { ACA_ERROR });
        if (
            !SILENT
        ) {
            throw ACA_ERROR;
        }
    }
}

module.exports = {
    loadManyByTenant,
}
