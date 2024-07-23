/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queue-board-provider-board-registry';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const REGISTRY = {};

const addOneByTenantId = (params) => {
    try {
        const TENANT_ID = ramda.path(['tenantId'], params);
        const BOARD_NEW = ramda.path(['board'], params);
        if (
            lodash.isEmpty(TENANT_ID)
        ) {
            const MESSAGE = 'Mising required params.tenantId parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        const BOARD_OLD = REGISTRY[TENANT_ID];
        if (
            !lodash.isEmpty(BOARD_OLD)
        ) {
            const MESSAGE = `Board with ${TENANT_ID} - already exists!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        if (
            lodash.isEmpty(BOARD_NEW)
        ) {
            const MESSAGE = 'Mising required params.board parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }

        REGISTRY[TENANT_ID] = BOARD_NEW;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('addOneByTenantID', { ACA_ERROR });
        throw ACA_ERROR;
    }
}


const removeOneByTenantID = (params) => {
    const TENANT_ID = ramda.path(['tenantId'], params);
    try {
        if (
            lodash.isEmpty(TENANT_ID)
        ) {
            const MESSAGE = 'Mising required params.tenantId parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        delete REGISTRY[TENANT_ID];
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('addOneByTenantID', { ACA_ERROR });
        throw ACA_ERROR;
    }
}


const getOneByTenantId = (params) => {
    const TENANT_ID = ramda.path(['tenantId'], params);
    try {
        if (
            lodash.isEmpty(TENANT_ID)
        ) {
            const MESSAGE = 'Mising required params.tenantId parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        const RET_VAL = REGISTRY[TENANT_ID];
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('getOneByTenantId', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const getRegistry = () => {
    return REGISTRY;
}

module.exports = {
    getRegistry,
    addOneByTenantId,
    getOneByTenantId,
    removeOneByTenantID,
}
