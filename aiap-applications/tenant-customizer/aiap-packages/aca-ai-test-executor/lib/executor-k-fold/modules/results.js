/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-testing-app-app-packages-kFold-modules-results';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const sk = require('@ibm-aca/aca-python-wrapper');
const dfd = require('@ibm-aca/aca-wrapper-danfojs-node');

const classificationReportFromDict = require('./classification-report');
const { convertDataframeToDictionary, transformAndFilterResults } = require('./utils');

const overallResults = async (combinedDf) => {
  try {
    let overallResults = {};
    const ACTUAL_INTENT_COLUMN = combinedDf['actualIntentCorrect'];
    const ACTUAL_INTENT_COLUMN_DATA = ACTUAL_INTENT_COLUMN?.$data;
    let actualIntentData = lodash.flatten(ACTUAL_INTENT_COLUMN_DATA);
    const PREDICTED_INTENT_COLUMN = combinedDf['predictedIntent'];
    const PREDICTED_INTENT_COLUMN_DATA = PREDICTED_INTENT_COLUMN?.$data;
    let predictedIntentData = lodash.flatten(PREDICTED_INTENT_COLUMN_DATA);
    const ACCURACY_SCORE = await sk.SKLearn('metrics', ['accuracy_score', actualIntentData, predictedIntentData], []);
    const ACCURACY_SCORE_RESULT = JSON.parse(ACCURACY_SCORE);
    const PRECISION_RECALL = await sk.SKLearn('metrics', ['precision_recall_fscore_support', actualIntentData, predictedIntentData], []);
    const PRECISION_RECALL_RESULT = JSON.parse(PRECISION_RECALL);
    overallResults['overall'] = {};
    overallResults['overall']['precision'] = PRECISION_RECALL_RESULT?.precision;
    overallResults['overall']['recall'] = PRECISION_RECALL_RESULT?.recall;
    overallResults['overall']['fscore'] = PRECISION_RECALL_RESULT?.fscore;
    overallResults['overall']['accuracy'] = ACCURACY_SCORE_RESULT;
    const CLASS_REPORT = await sk.SKLearn('metrics', ['classification_report', actualIntentData, predictedIntentData], []);
    const CLASS_REPORT_RESULTS = JSON.parse(CLASS_REPORT);
    overallResults['classificationReport'] = CLASS_REPORT_RESULTS;
    let resultsValues = Object.values(overallResults['classificationReport']);
    let resultsKeys = Object.keys(overallResults['classificationReport']);
    const REPORT_DF = classificationReportFromDict(resultsValues, resultsKeys);
    let reportLeast = REPORT_DF.sortValues('f1-score').resetIndex();
    overallResults['leastIntents'] = convertDataframeToDictionary(reportLeast);
    let reportTop = REPORT_DF.sortValues('f1-score', { ascending: false }).resetIndex();
    overallResults['topIntents'] = convertDataframeToDictionary(reportTop);
    overallResults['classificationReport'] = transformAndFilterResults(CLASS_REPORT_RESULTS);
    return overallResults;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', ACA_ERROR);
    throw ACA_ERROR;
  }
}

const incorrectMatches = (combinedDf, threshold) => {
  const DF_COLUMNS = combinedDf?.columns;
  let incorrectMatches = {};
  incorrectMatches = incorrectWithHighConfidence(incorrectMatches, combinedDf, DF_COLUMNS, threshold);
  incorrectMatches = incorrectWithLowConfidence(incorrectMatches, combinedDf, DF_COLUMNS, threshold);
  incorrectMatches = correctWithLowConfidence(incorrectMatches, combinedDf, DF_COLUMNS, threshold);
  return incorrectMatches;
}

const incorrectWithHighConfidence = (incorrectMatchesObject, combinedDf, DF_COLUMNS, threshold) => {
  let retVal = [];
  const COMBINED_DATAFRAME_DATA = combinedDf?.$data;
  for (let i = 0; i < COMBINED_DATAFRAME_DATA.length; i++) {
    if ((COMBINED_DATAFRAME_DATA[i][1] !== COMBINED_DATAFRAME_DATA[i][2]) && (COMBINED_DATAFRAME_DATA[i][3] >= threshold)) {
      retVal.push(COMBINED_DATAFRAME_DATA[i]);
    }
  }
  if (retVal.length === 0) {
    logger.info('->', 'NO ISSUES FOUND');
  }
  else {
    let incorrect1 = new dfd.DataFrame(retVal, { columns: DF_COLUMNS });
    logger.info('->', 'Incorrect intent was triggered with high confidence');
    logger.info('->', `Detected: ${retVal.length} samples`);
    incorrectMatchesObject['incorrectWithHighConfidence'] = convertDataframeToDictionary(incorrect1);
  }
  return incorrectMatchesObject;
}

const incorrectWithLowConfidence = (incorrectMatchesObject, combinedDf, DF_COLUMNS, threshold) => {
  let retVal = [];
  const COMBINED_DATAFRAME_DATA = combinedDf?.$data;
  for (let i = 0; i < COMBINED_DATAFRAME_DATA.length; i++) {
    if ((COMBINED_DATAFRAME_DATA[i][1] !== COMBINED_DATAFRAME_DATA[i][2]) && (COMBINED_DATAFRAME_DATA[i][3] < threshold)) {
      retVal.push(COMBINED_DATAFRAME_DATA[i]);
    }
  }
  if (retVal.length === 0) {
    logger.info('->', 'NO ISSUES FOUND');
  }
  else {
    let incorrect2 = new dfd.DataFrame(retVal, { columns: DF_COLUMNS });
    logger.info('->', 'Incorrect intent was triggered with low confidence');
    logger.info('->', `Detected: ${retVal.length} samples`);
    incorrectMatchesObject['incorrectWithLowConfidence'] = convertDataframeToDictionary(incorrect2);
  }
  return incorrectMatchesObject;
}

const correctWithLowConfidence = (incorrectMatchesObject, combinedDf, DF_COLUMNS, threshold) => {
  let retVal = [];
  const COMBINED_DATAFRAME_DATA = combinedDf?.$data;
  for (let i = 0; i < COMBINED_DATAFRAME_DATA.length; i++) {
    if ((COMBINED_DATAFRAME_DATA[i][1] === COMBINED_DATAFRAME_DATA[i][2]) && (COMBINED_DATAFRAME_DATA[i][3] < threshold)) {
      retVal.push(COMBINED_DATAFRAME_DATA[i]);
    }
  }
  if (retVal.length === 0) {
    logger.info('->', 'NO ISSUES FOUND');
  }
  else {
    let incorrect3 = new dfd.DataFrame(retVal, { columns: DF_COLUMNS });
    logger.info('->', 'Correct intent was triggered but with low confidence');
    logger.info('->', `Detected: ${retVal.length} samples`);
    incorrectMatchesObject['correctWithLowConfidence'] = convertDataframeToDictionary(incorrect3);
  }
  return incorrectMatchesObject;
}
module.exports = {
  overallResults,
  incorrectMatches,
};
