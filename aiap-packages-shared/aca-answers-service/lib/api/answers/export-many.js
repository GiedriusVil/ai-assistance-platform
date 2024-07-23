/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-service-answers-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const answerStoreService = require('../answer-stores');

const exportMany = async (context, params) => {
    try {
        const CURRENT_ANSWERS = await answerStoreService.findOneById(context, params);
        const RET_VAL = {
            answers: CURRENT_ANSWERS.answers
        };
        logger.info('Export many: ', RET_VAL);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    exportMany,
}
