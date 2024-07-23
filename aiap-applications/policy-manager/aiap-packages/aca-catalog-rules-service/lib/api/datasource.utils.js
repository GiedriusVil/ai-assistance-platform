/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-catalog-rules-service-datasource-utils`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getAcaCatalogRulesDatasourceByContext } = require('@ibm-aca/aca-catalog-rules-datasource-provider');

const getCatalogRulesDatasource = (context) => {
    try {
        const RET_VAL = getAcaCatalogRulesDatasourceByContext(context);
        if (
            lodash.isEmpty(RET_VAL)
        ) {
            const MESSAGE = `Unable to retrieve aca-catalog-rules-datasource! ${RET_VAL}`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('getCatalogRulesDatasource', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const getFindManyQuery = (filter = {}) => {
    return {
        filter: filter,
        sort: {},
        pagination: {
            page: 1,
            size: 10000
        }
    }
};

module.exports = {
    getFindManyQuery,
    getCatalogRulesDatasource,
}
