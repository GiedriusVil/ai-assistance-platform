/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-ai-test-executor-lib-kFoldExecutor-actions-setInProgress';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { handleKfoldError } = require('./handle-k-fold-error');
const { calculateDuration } = require('./calculate-test-duration');
const { saveToDB } = require('./save-to-db');


const setInProgress = async (context, params, testID) => {
  let metrics = {}
  try {
    metrics['testName'] = params?.name;
    metrics['testType'] = 'kfold';
    metrics['started'] = new Date();
    metrics['duration'] = calculateDuration();
    metrics['assistant'] = params?.assistant;
    metrics['skillId'] = params?.aiSkillId;
    metrics['status'] = 'In progress';
    metrics['threshold'] = params?.threshold;
    metrics['thresholdConfusion'] = params?.confusion;
    saveToDB(context, metrics, testID);
    return metrics
  } catch (error) {
    await handleKfoldError(context, error, metrics, testID);
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', ACA_ERROR);
    throw ACA_ERROR;
  }
}
module.exports = {
  setInProgress
}
