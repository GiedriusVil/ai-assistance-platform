/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-test-executor-k-Fold-actions-create-folds';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { handleKfoldError } = require('./handle-k-fold-error');
const kfold = require('../modules');

const createFolds = async (context, params, options) => {
    try {
        const INTENTS = options?.intents;
        let kfoldNumber = parseInt(params.kfoldNumber);
        const FOLDS_LIST = await kfold.createFolds(INTENTS, kfoldNumber);
        return FOLDS_LIST;
    } catch (error) {
        const CALCULATED_METRICS = options?.calculatedMetrics;
        const TEST_ID = options?.testId;
        await handleKfoldError(context, error,CALCULATED_METRICS,TEST_ID);
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', ACA_ERROR);
        throw ACA_ERROR;
    }
}
module.exports = {
    createFolds
}
