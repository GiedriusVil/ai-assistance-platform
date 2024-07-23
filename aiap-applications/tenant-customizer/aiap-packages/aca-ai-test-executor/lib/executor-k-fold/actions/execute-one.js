/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-test-executor-k-fold-execute-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { v4: uuidv4 } = require('uuid');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { aiServicesService } = require('@ibm-aiap/aiap-ai-services-service');

const {
  getAiServiceClientByAiService,
} = require('@ibm-aiap/aiap-ai-service-client-provider');

const { setInProgress } = require('./set-in-progress');
const { getIntents } = require('./get-intents');
const { getEntities } = require('./get-entities');
const { prepareKfold } = require('./prepare-k-fold');
const { runTest } = require('./run-k-fold-test');
const { generatedMetrics } = require('./generated-metrics');
const { handleKfoldError } = require('./handle-k-fold-error');
const { deleteSkillsWA } = require('./delete-workspaces');

const executeOne = async (context, params) => {

  let folds = [];
  let intentsDF;
  let calculatedMetrics = {};
  let testID;
  let workspacesIds = [];
  const AI_SERVICE = await aiServicesService.findOneById(context, params);
  const ASSISTANT = await getAiServiceClientByAiService({}, { aiService: AI_SERVICE });
  try {
    testID = uuidv4();
    calculatedMetrics = await setInProgress(context, params, testID);
    intentsDF = await getIntents(context, params, {
      type: 'dataframe',
      calculatedMetrics: calculatedMetrics,
      testID: testID,
      assistant: ASSISTANT
    });
    const ENTITIES = await getEntities(context, params, {
      calculatedMetrics: calculatedMetrics,
      testID: testID,
      assistant: ASSISTANT
    });
    const INTENTS_DICT = await getIntents(context, params, {
      type: 'dictionary',
      calculatedMetrics: calculatedMetrics,
      testID: testID,
      assistant: ASSISTANT
    });
    let prepareFold = await prepareKfold(context, params, {
      intentsDataframe: intentsDF,
      intentsDictionary: INTENTS_DICT,
      entities: ENTITIES,
      calculatedMetrics: calculatedMetrics,
      testID: testID,
      assistant: ASSISTANT
    });
    folds = prepareFold.folds;
    workspacesIds = prepareFold.workspacesIds;
    let dfResults = await runTest(context, params, {
      folds: folds,
      intents: intentsDF,
      workspaces: workspacesIds,
      testId: testID,
      calculatedMetrics: calculatedMetrics,
      assistant: ASSISTANT
    });
    await generatedMetrics(context, params, {
      testResultsDataframe: dfResults,
      calculatedMetrics: calculatedMetrics,
      testId: testID
    });
  } catch (error) {
    await handleKfoldError(context, error, calculatedMetrics, testID);
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', ACA_ERROR);
    throw ACA_ERROR;
  } finally {
    await deleteSkillsWA(context, params, {
      workspaces: workspacesIds,
      assistant: ASSISTANT
    })
  }
}

module.exports = {
  executeOne
}
