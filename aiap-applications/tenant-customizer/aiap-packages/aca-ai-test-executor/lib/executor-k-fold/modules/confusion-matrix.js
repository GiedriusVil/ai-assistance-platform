/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-testing-app-app-packages-kFold-modules-confusion-matrix';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const dfd = require('@ibm-aca/aca-wrapper-danfojs-node');
const sk = require('@ibm-aca/aca-python-wrapper');

const { retrieveDataframeColumnDataByName, compareActualAndPredictedIntentLabels } = require('./utils');

const confusionMatrixDataPrep = async (dataframesList, threshold) => {
  try {
    let dataframe = dfd.concat({ dfList: dataframesList, axis: 0 });
    dataframe = dataframe.resetIndex();
    const ACTUAL_INTENT_1_DATA = retrieveDataframeColumnDataByName(dataframe, 'actualIntent1');
    const PREDICTED_INTENT_DATA = retrieveDataframeColumnDataByName(dataframe, 'predictedIntent');
    const ACTUAL_INTENT_COLUMN = dataframe['actualIntent1'];
    const ACTUAL_INTENT_LABELS = ACTUAL_INTENT_COLUMN.unique();
    const ACTUAL_INTENT_LABELS_DATA = ACTUAL_INTENT_LABELS?.$data;
    const PREDICTED_INTENT_COLUMN = dataframe['predictedIntent'];
    const PREDICTED_INTENT_LABELS = PREDICTED_INTENT_COLUMN.unique();
    const PREDICTED_INTENT_LABELS_DATA = PREDICTED_INTENT_LABELS?.$data;
    const PREDICTED_INTENTS = compareActualAndPredictedIntentLabels(ACTUAL_INTENT_LABELS_DATA, PREDICTED_INTENT_LABELS_DATA);
    const PREDICTED_INTENTS_DATA = PREDICTED_INTENTS?.predictedIntents;
    const LABELS_DIFFERENCE = PREDICTED_INTENTS?.labelsDifference;
    let estimator = ['confusion_matrix', ACTUAL_INTENT_1_DATA, PREDICTED_INTENT_DATA, ACTUAL_INTENT_LABELS_DATA];
    const MATRIX = await sk.SKLearn('metrics', estimator, []);
    const MATRIX_RESULT = JSON.parse(MATRIX);
    const LABELS = lodash.union(ACTUAL_INTENT_LABELS_DATA, PREDICTED_INTENTS_DATA);
    return {
      matrix: MATRIX_RESULT,
      labels: LABELS,
      dataframe: dataframe,
      unhittedIntents: LABELS_DIFFERENCE
    };
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { threshold });
    logger.error(`${confusionMatrixDataPrep.name}`, ACA_ERROR);
    throw ACA_ERROR;
  }
}

module.exports = confusionMatrixDataPrep;
