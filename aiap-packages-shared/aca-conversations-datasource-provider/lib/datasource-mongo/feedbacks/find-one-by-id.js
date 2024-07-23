/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasoure-feedbacks-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { findManyByQuery } = require('./find-many-by-query');

const findOneById = async (datasource, context, params) => {
    try {
        const RESULT = await findManyByQuery(datasource, context, params);
        const RET_VAL = ramda.path('items', [0], RESULT);

        logger.info('RET_VAL', { RET_VAL });
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(findOneById.name, { ACA_ERROR });
        throw ACA_ERROR;
    }
}


module.exports = {
    findOneById
}
