/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-buy-rules-service-datasource-utils`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getAcaBuyRulesDatasourceByContext } = require('@ibm-aca/aca-buy-rules-datasource-provider');

const getBuyRulesDatasource = (context) => {
    try {
        const RET_VAL = getAcaBuyRulesDatasourceByContext(context);
        if (
            lodash.isEmpty(RET_VAL)
        ) {
            const MESSAGE = `Unable to retrieve aca-buy-rules-datasource!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('getBuyRulesDatasource', { ACA_ERROR });
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
    getBuyRulesDatasource,
}
