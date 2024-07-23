/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-ai-test-executor-lib-kFoldExecutor-actions-runKFoldTest';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { handleKfoldError } = require('./handle-k-fold-error');
const kfold = require('../modules');


const runTest = async (context, params, options) => {
    try {
        const FOLDS = options?.folds;
        const INTENTS = options?.intents;
        const WORKSPACES_IDS = options?.workspaces;
        const ASSISTANT = options?.assistant;
        let isReady = false;
        let attemptNumber = 0;
        while (!isReady) {
            isReady = await ASSISTANT.skills.checkManyByIdsForStatusAvailable(context, {
              ids: WORKSPACES_IDS
            });
            if (attemptNumber > 500) {
                logger.error('[KFOLD] WA skill training too long - max retry count reached');
            }
            if (!isReady) {
                attemptNumber += 1;
            }
        }
        let resultsKfold = await kfold.runKFoldTest(context, params, {
            folds: FOLDS,
            intents: INTENTS,
            workspaces: WORKSPACES_IDS,
            assistant : ASSISTANT
        });
        return resultsKfold;
    } catch (error) {
        const CALCULATED_METRICS = options?.calculatedMetrics;
        const TEST_ID = options?.testId;
        await handleKfoldError(context, error, CALCULATED_METRICS, TEST_ID);
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', ACA_ERROR);
        throw ACA_ERROR;
    }
}
module.exports = {
    runTest
}
