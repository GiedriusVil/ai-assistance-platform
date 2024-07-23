/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-classes-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const findOneAndModify = async (context, params) => {
    try {
        const DATASOURCE = getDatasourceByContext(context);
        return await DATASOURCE.actions.findOneAndModify(context, params);
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(findOneAndModify.name, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    findOneAndModify,
}
