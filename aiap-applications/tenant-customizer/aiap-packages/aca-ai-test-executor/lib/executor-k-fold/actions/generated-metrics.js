/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-ai-test-executor-lib-kFoldExecutor-actions-generatedMetrics';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { handleKfoldError } = require('./handle-k-fold-error');
const { convertDataframeToDictionary, convertMatrixDataToIntents } = require('../modules/utils');
const { calculateDuration } = require('./calculate-test-duration');
const { saveToDB } = require('./save-to-db');

const kfold = require('../modules');

const generatedMetrics = async (context, params, options) => {
    const TEST_RESULTS_DATAFRAME = options?.testResultsDataframe;
    const CALCULATED_METRICS = options?.calculatedMetrics;
    const TEST_ID = options?.testId;
    try {
        const RESULTS_KFOLD = TEST_RESULTS_DATAFRAME;
        const THRESHOLD = params?.threshold;
        const FOLD_METRICS = await kfold.defineMetrics(RESULTS_KFOLD, THRESHOLD);
        CALCULATED_METRICS['metrics'] = {};
        CALCULATED_METRICS['metrics']['kfold'] = FOLD_METRICS;
        const CONFUSION_MATRIX_DATA = await kfold.confusionMatrixDataPrep(RESULTS_KFOLD, THRESHOLD);
        CALCULATED_METRICS['testResult'] = convertDataframeToDictionary(CONFUSION_MATRIX_DATA.dataframe);
        CALCULATED_METRICS['matrix'] = {}
        CALCULATED_METRICS['matrix']['data'] = CONFUSION_MATRIX_DATA?.matrix;
        CALCULATED_METRICS['matrix']['labels'] = CONFUSION_MATRIX_DATA?.labels;
        CALCULATED_METRICS['matrix']['intents'] = convertMatrixDataToIntents(CONFUSION_MATRIX_DATA);
        const METRICS = await kfold.overallResults(CONFUSION_MATRIX_DATA.dataframe);
        CALCULATED_METRICS['metrics']['overall'] = METRICS;
        const INCORRECT_MATCHES = kfold.incorrectMatches(CONFUSION_MATRIX_DATA.dataframe, THRESHOLD);
        CALCULATED_METRICS['incorrectMatches'] = INCORRECT_MATCHES;
        CALCULATED_METRICS['status'] = 'Success';
        CALCULATED_METRICS['ended'] = new Date();
        CALCULATED_METRICS['duration'] = calculateDuration(CALCULATED_METRICS);
        CALCULATED_METRICS['warnings'] = CONFUSION_MATRIX_DATA.unhittedIntents;
        saveToDB(context, CALCULATED_METRICS,TEST_ID);
        return CALCULATED_METRICS;
    } catch (error) {
        await handleKfoldError(context, error,CALCULATED_METRICS,TEST_ID);
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', ACA_ERROR);
        throw ACA_ERROR;
    }
}
module.exports = {
    generatedMetrics
}
