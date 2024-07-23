/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-actions-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const saveOne = async (context, params) => {
    try {
        const DATASOURCE = getDatasourceByContext(context);
        const RET_VAL = await DATASOURCE.actions.saveOne(context, params);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(saveOne.name, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    saveOne,
}
