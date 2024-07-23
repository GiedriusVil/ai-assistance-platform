/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-ai-test-executor-lib-kFoldExecutor-actions-saveToDb';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getAiServicesDatasourceByContext } = require('@ibm-aiap/aiap-ai-services-datasource-provider');

const saveToDB = async (context, params, testID) => {
  try {
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    const PARAMS = { 
      value: {
        ...params,
        id: testID,
      }
    };
    const RET_VAL = await DATASOURCE.aiServiceTests.saveOne(context, PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveToDB.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
module.exports = {
  saveToDB
}
