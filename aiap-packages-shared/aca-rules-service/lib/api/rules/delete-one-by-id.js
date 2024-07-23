/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-rules-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');
const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');
const { rulesAuditorService } = require('@ibm-aca/aca-auditor-service');
const { AIAP_EVENT_TYPE, getEventStreamByContext } = require('@ibm-aiap/aiap-event-stream-provider');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const runtimeDataService = require('../runtime-data');

const _deleteOneById = async (context, params) => {
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const RET_VAL = await DATASOURCE.rules.deleteOneById(context, params);

  await runtimeDataService.deleteManyByIdsFromConfigDirectoryRules(context, { ids: [params.id] });

  const AUDIT_PARAMS = {
    action: 'DELETE',
    docId: params.id,
    docType: 'RULE',
    doc: {
      id: params.id,
    },
  };
  await rulesAuditorService.saveOne(context, AUDIT_PARAMS);
  getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.RESET_ENGINES, {});
  return RET_VAL;
}

const deleteOneById = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _deleteOneById, context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteOneById,
}
