/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answer-service-answer-stores-pull-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { pullOne } = require('./pull-one');

const pullManyByIds = async (context, params) => {

    const ANSWER_STORES_IDS = params?.ids;
    try {
        if (
            lodash.isEmpty(ANSWER_STORES_IDS)
        ) {
            const MESSAGE = `Missing required params.ids parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (
            !lodash.isArray(ANSWER_STORES_IDS)
        ) {
            const MESSAGE = `Wrong type of params.ids parameter! [Array - expected]`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const PROMISES = [];
        for (let answerStoreId of ANSWER_STORES_IDS) {
            PROMISES.push(pullOne(context, { id: answerStoreId }));
        }
        const RET_VAL = await Promise.all(PROMISES);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { ANSWER_STORES_IDS });
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    pullManyByIds,
} 
