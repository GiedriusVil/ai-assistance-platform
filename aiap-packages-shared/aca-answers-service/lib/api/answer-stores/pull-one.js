/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-service-answer-store-releases-pull-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { findOneById } = require('./find-one-by-id');
const { saveOne: answerStoreReleaseSaveOne } = require('../answer-store-releases/save-one');
const { saveOne } = require('./save-one');
const answersUtils = require('../answers-utils');

const pullOne = async (context, params) => {
    try {
        const ANSWER_STORE_ID = ramda.path(['id'], params);
        if (
            lodash.isEmpty(ANSWER_STORE_ID)
        ) {
            throw new Error(`[${MODULE_ID}] Missing required params.id attribute!`);
        }
        const CURRENT_ANSWER_STORE = await findOneById(context, params);
        const SOURCE_ANSWER_STORE = await answersUtils._retrieveSourceAnswerStore(context, CURRENT_ANSWER_STORE);
        const TARGET_ANSWER_STORE = answersUtils._mergeAnswerStore(CURRENT_ANSWER_STORE, SOURCE_ANSWER_STORE);
        const DATE = new Date();
        const ANSWER_STORE_RELEASE = {
            answerStoreId: ANSWER_STORE_ID,
            created: DATE,
            createdT: DATE.getTime(),
            deployed: DATE,
            deployedT: DATE.getTime(),
            versions: {
                source: SOURCE_ANSWER_STORE,
                target: CURRENT_ANSWER_STORE,
                deployed: TARGET_ANSWER_STORE,
            }
        }
        const SAVE_ANSWER_STORE_RELEASE_PARAMS = {
            answerStoreRelease: ANSWER_STORE_RELEASE
        }
        logger.debug('->', { SAVE_ANSWER_STORE_RELEASE_PARAMS });
        await answerStoreReleaseSaveOne(context, SAVE_ANSWER_STORE_RELEASE_PARAMS);
        const SAVE_ANSWER_STORE_PARAMS = {
            answerStore: TARGET_ANSWER_STORE
        }
        logger.debug('->', { SAVE_ANSWER_STORE_PARAMS });
        await saveOne(context, SAVE_ANSWER_STORE_PARAMS);
        const RET_VAL = {
            status: 'SUCCESS',
            before: CURRENT_ANSWER_STORE,
            after: TARGET_ANSWER_STORE
        }
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw error;
    }
}

module.exports = {
    pullOne,
}
