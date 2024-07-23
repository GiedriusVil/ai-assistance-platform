/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-ai-test-executor-lib-kFoldExecutor-actions-prepareKFold';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { handleKfoldError } = require('./handle-k-fold-error');
const { createFolds } = require('./create-folds');
const { saveToDB } = require('./save-to-db');
const { createSkillsWA } = require('./create-skills-wa');


const prepareKfold = async (context, params, options) => {
  const INTENTS_DATAFRAME = options?.intentsDataframe;
  const INTENTS_DICTIONARY = options?.intentsDictionary;
  const ENTITIES = options?.entities;
  const CALCULATED_METRICS = options?.calculatedMetrics;
  const TEST_ID = options?.testID;
  const ASSISTANT = options?.assistant;
  try {
    await ASSISTANT.skills.countManyByQuery(context, params);
    let kfoldData = getKFoldData();
    const FOLDS = await createFolds(context, params, {
      intents: INTENTS_DATAFRAME,
      calculatedMetrics: CALCULATED_METRICS,
      testId: TEST_ID
    });
    kfoldData['intents'] = INTENTS_DICTIONARY;
    kfoldData['folds'] = FOLDS;
    const WORKSPACES_IDS = await createSkillsWA(context, params, {
      assistant: ASSISTANT,
      folds: FOLDS,
      intents: INTENTS_DATAFRAME,
      entities: ENTITIES,
      calculatedMetrics: CALCULATED_METRICS
    });
    kfoldData['createdSkillsIds'] = WORKSPACES_IDS
    saveToDB(context, { kfoldData: kfoldData }, TEST_ID);
    return {
      folds: FOLDS,
      workspacesIds: WORKSPACES_IDS
    };
  } catch (error) {
    await handleKfoldError(context, error, CALCULATED_METRICS, TEST_ID);
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', ACA_ERROR);
    throw ACA_ERROR;
  }
}

const getKFoldData = () => {
  const RET_VAL = {
    _id: 'kfold_internal_data',
  };
  return RET_VAL;
}

module.exports = {
  prepareKfold
}
