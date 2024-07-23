/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-testing-app-app-packages-kFold-modules-metrics';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const dfd = require('@ibm-aca/aca-wrapper-danfojs-node');
const sk = require('@ibm-aca/aca-python-wrapper');

const { convertDataframeToDictionary, checkIntentsForThreshold } = require('./utils');


/**
 define the metrics of the k-fold

:param KFoldResults: is the list of results coming from `run_kfold_test` function
:return resultTable: is the dataframe containing the metrics for each fold. 
 */
const prepData = (dataframe, threshold) => {
    let actualIntentDataframe = dataframe.loc({ columns: ['actualConfidence1'] });
    let predictedIntentDataframe = dataframe.loc({ columns: ['actualIntent1'] });
    const ACTUAL_INTENT_COLUMN_DATA = actualIntentDataframe?.$data;
    const PREDICTED_INTENT_COLUMN_DATA = predictedIntentDataframe?.$data;
    const ACTUAL_INTENT_FLATTEN_DATA = lodash.flatten(ACTUAL_INTENT_COLUMN_DATA);
    const PREDICTED_INTENT_FLATTEN_DATA = lodash.flatten(PREDICTED_INTENT_COLUMN_DATA);
    let correctIntent = checkIntentsForThreshold(ACTUAL_INTENT_FLATTEN_DATA, threshold, PREDICTED_INTENT_FLATTEN_DATA);
    dataframe.addColumn('actualIntentCorrect', correctIntent, { inplace: true });
    
    return dataframe;
}
const defineMetrics = async (KFoldResults, threshold) => {
    try {
        const DUMMY_DATA = [[0, 1, 0, 5, 6, 7, 4, 7]];
        let resultTable = new dfd.DataFrame(DUMMY_DATA, {
            columns: ['fold', 'totalTested', 'incorrect', 'incorrectAvgConfidence', 'accuracy', 'precision', 'recall', 'fscore']
        });
        let index = 1;
        for (let i in lodash.range(KFoldResults.length)) {
            let data = prepData(KFoldResults[i], threshold);
            let actualIntentDataframe = data.loc({ columns: ['actualIntentCorrect'] });
            let predictedIntentDataframe = data.loc({ columns: ['predictedIntent'] });
            const ACTUAL_INTENT_COLUMN_DATA = actualIntentDataframe?.$data;
            const PREDICTED_INTENT_COLUMN_DATA = predictedIntentDataframe?.$data;
            const ACTUAL_INTENT_FLATTEN_DATA = lodash.flatten(ACTUAL_INTENT_COLUMN_DATA);
            const PREDICTED_INTENT_FLATTEN_DATA = lodash.flatten(PREDICTED_INTENT_COLUMN_DATA);
            let incorrectIntents = lodash.difference(ACTUAL_INTENT_FLATTEN_DATA, PREDICTED_INTENT_FLATTEN_DATA);
            let incorrectAvgConfidence = data.loc({ columns: ['actualConfidence1'] }).mean();
            const PRECISION_RECALL = await sk.SKLearn('metrics', ['precision_recall_fscore_support', ACTUAL_INTENT_FLATTEN_DATA, PREDICTED_INTENT_FLATTEN_DATA], []);
            const PRECISION_RECALL_RESULT = JSON.parse(PRECISION_RECALL);
            const ACCURACY_SCORE = await sk.SKLearn('metrics', ['accuracy_score', ACTUAL_INTENT_FLATTEN_DATA, PREDICTED_INTENT_FLATTEN_DATA], []);
            const ACCURACY_SCORE_RESULT = JSON.parse(ACCURACY_SCORE);
            const K_FOLD_RESULTS = KFoldResults?.[i];
            const TOTAL_TESTED = K_FOLD_RESULTS?.$data;
            const INCORRECT_AVERAGE_CONFIDENCE = incorrectAvgConfidence?.$data;
            const RESULTS_TO_APPEND = [
                i,
                TOTAL_TESTED.length,
                incorrectIntents.length,
                INCORRECT_AVERAGE_CONFIDENCE,
                ACCURACY_SCORE_RESULT,
                PRECISION_RECALL_RESULT['precision'],
                PRECISION_RECALL_RESULT['recall'],
                PRECISION_RECALL_RESULT['fscore']
            ];

            resultTable = resultTable.append([RESULTS_TO_APPEND], [index]);
            index++;
        }
        resultTable.drop({ index: [0], axis: 0, inplace: true });
        let reset = resultTable.resetIndex();
        const RET_VAL = convertDataframeToDictionary(reset);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', ACA_ERROR);
        throw ACA_ERROR;
    }
}
module.exports = defineMetrics;
