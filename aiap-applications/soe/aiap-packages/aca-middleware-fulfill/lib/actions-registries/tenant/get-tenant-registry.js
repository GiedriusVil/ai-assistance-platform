/*
  © Copyright IBM Corporation 2022. All Rights Reserved.

  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-fulfill-actions-registry-get-tenant-registry';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const REGISTRY = {};

const getRegistry = () => {
    return REGISTRY;
}

const _ensureTenantRegistry = (tenantId) => {
    try {
        if (
            lodash.isEmpty(tenantId)
        ) {
            const MESSAGE = `Missing required tenantId parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const TENANT_REGISTRY = REGISTRY[tenantId];
        if (
            !TENANT_REGISTRY
        ) {
            REGISTRY[tenantId] = {};
        }
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('_ensureTenantRegistry', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const getTenantRegistry = (tenantId) => {
    try {
        _ensureTenantRegistry(tenantId);
        const RET_VAL = REGISTRY[tenantId];
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('getTenantRegistry', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    getRegistry,
    getTenantRegistry,
}
