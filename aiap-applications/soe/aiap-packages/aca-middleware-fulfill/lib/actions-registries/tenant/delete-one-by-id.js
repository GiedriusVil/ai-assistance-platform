/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-fulfill-actions-registry-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getTenantRegistry } = require('./get-tenant-registry');

const deleteOneById = async (context, params) => {
    const TENANT_ID = ramda.path(['tenant', 'id'], context);
    const ACTION_TAG_ID = ramda.path(['id'], params);
    try {
        if (
            lodash.isEmpty(TENANT_ID)
        ) {
            const MESSAGE = `Missing required context.tenant.id parameter`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (
            lodash.isEmpty(ACTION_TAG_ID)
        ) {
            const MESSAGE = `Missing required params.id parameter`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const REGISTRY = getTenantRegistry(TENANT_ID);
        const ACTION_TAG = REGISTRY[ACTION_TAG_ID];
        if (
            lodash.isEmpty(ACTION_TAG)
        ) {
            return;
        }
        delete REGISTRY[ACTION_TAG_ID];
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { TENANT_ID, ACTION_TAG_ID });
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}


module.exports = {
    deleteOneById,
}
