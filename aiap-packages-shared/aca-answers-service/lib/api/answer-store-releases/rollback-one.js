/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-service-answer-store-releases-rollback-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const answerStoreService = require('../answer-stores');
const { findOneById } = require('./find-one-by-id');
const { saveOne } = require('./save-one');

const rollbackOne = async (context, params) => {
    try {
        const ANSWER_STORE_RELEASE = await findOneById(context, params);
        if (
            lodash.isEmpty(ANSWER_STORE_RELEASE)
        ) {
            const ACA_ERROR = {
                type: 'SYSTEM_ERROR',
                message: `[${MODULE_ID}] unable to retrieve answer store release.`,
                params: params
            };
            throw ACA_ERROR;
        }
        const ANSWER_STORE = ramda.path(['versions', 'deployed'], ANSWER_STORE_RELEASE);
        if (
            lodash.isEmpty(ANSWER_STORE)
        ) {
            const ACA_ERROR = {
                type: 'SYSTEM_ERROR',
                message: `[${MODULE_ID}] unable to retrieve deployed answer store from release.`,
                params: params
            };
            throw ACA_ERROR;
        }
        const SAVE_ANSWER_STORE_PARAMS = {
            answerStore: ANSWER_STORE
        }
        answerStoreService.saveOne(context, SAVE_ANSWER_STORE_PARAMS);
        const DATE = new Date();
        ANSWER_STORE_RELEASE.deployed = DATE;
        ANSWER_STORE_RELEASE.deployedT = DATE.getTime();
        const SAVE_ANSWER_STORE_RELEASE_PARAMS = {
            answerStoreRelease: ANSWER_STORE_RELEASE
        }
        await saveOne(context, SAVE_ANSWER_STORE_RELEASE_PARAMS);
        const RET_VAL = { status: 'success' };
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    rollbackOne,
}
