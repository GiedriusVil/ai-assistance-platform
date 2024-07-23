/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-service-answer-stores-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const { getDatasourceByContext } = require('../datasource.utils');

const runtimeDataService = require('../runtime-data');

const saveOne = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    appendAuditInfo(context, params?.answerStore);
    const RET_VAL = await DATASOURCE.answerStores.saveOne(context, params);

    await runtimeDataService.synchronizeWithConfigDirectoryAnswersStore(context, { answersStore: RET_VAL });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
