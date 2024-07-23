/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');
const { rulesAuditorService } = require('@ibm-aca/aca-auditor-service');

const { AIAP_EVENT_TYPE, getEventStreamByContext } = require('@ibm-aiap/aiap-event-stream-provider');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');


const runtimeDataService = require('../runtime-data');

const _deleteManyByIds = async (context, params) => {
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const RET_VAL = await DATASOURCE.rules.deleteManyByIds(context, params);

  await runtimeDataService.deleteManyByIdsFromConfigDirectoryRules(context, { ids: params });

  const IDS = params;
  if (lodash.isArray(IDS)) {
    const PROMISES = [];
    IDS.forEach(id => {
      const AUDIT_PARAMS = {
        action: 'DELETE',
        docId: id,
        docType: 'RULE',
        doc: {
          id: id,
        },
      };
      PROMISES.push(rulesAuditorService.saveOne(context, AUDIT_PARAMS));
    });
    await Promise.all(PROMISES);
    getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.RESET_ENGINES, {});
  }
  return RET_VAL;
}

const deleteManyByIds = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _deleteManyByIds, context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByIds,
}
