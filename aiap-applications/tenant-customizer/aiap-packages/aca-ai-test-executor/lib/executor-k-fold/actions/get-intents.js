/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-ai-test-executor-lib-kFoldExecutor-actions-getIntents';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { handleKfoldError } = require('./handle-k-fold-error');
const { convertDataframeToDictionary,convertIntentsToDataframe } = require('../modules/utils');

const getIntents = async (context, params, options) => {
    try {
        const DATAFRAME_TYPE = options?.type;
        const ASSISTANT = options?.assistant;
        const K_FOLD_NUMBER = params?.kfoldNumber;
        const PARAMS = {
          query: {
            filter: {
              aiSkill: params,
            },
          },
        };
        const INTENTS = await ASSISTANT.intents.retrieveManyByQueryWithExamples(context, PARAMS);
        if (lodash.isEmpty(INTENTS)) {
            const ACA_ERROR = {
                type: 'VALIDATION_ERROR',
                message: `[${MODULE_ID}] Cannot run test on skill with 0 intents.`
            };
            throw ACA_ERROR;
        }

        const HAS_INTENT_WITH_INSUFFICIENT_EXAMPLES = lodash.find(INTENTS?.items, (intent) => {
            const EXAMPLES = intent?.external?.examples;
            if (lodash.isArray(EXAMPLES)) {
                return EXAMPLES.length < K_FOLD_NUMBER;
            }   
        });
        if (!lodash.isEmpty(HAS_INTENT_WITH_INSUFFICIENT_EXAMPLES)) {
            const ACA_ERROR = {
                type: 'VALIDATION_ERROR',
                message: `[${MODULE_ID}] Cannot run test - one or more intents has less number of examples than number of Folds you defined.`
            };
            throw ACA_ERROR;
        }
        const INTENTS_DATAFRAME = convertIntentsToDataframe(INTENTS?.items);
        let intentsToDict = convertDataframeToDictionary(INTENTS_DATAFRAME, 'list');
    if (DATAFRAME_TYPE === 'dictionary') {
        return intentsToDict;
    }
    else {
        return INTENTS_DATAFRAME;
    }
    } catch (error) {
        const TEST_ID = options?.testID;
        const CALCULATED_METRICS = options?.calculatedMetrics;
        await handleKfoldError(context, error,CALCULATED_METRICS,TEST_ID);
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', ACA_ERROR);
        throw ACA_ERROR;
    }
}
module.exports = {
    getIntents
}
