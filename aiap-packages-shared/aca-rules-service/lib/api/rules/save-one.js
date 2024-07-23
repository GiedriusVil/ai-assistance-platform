/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-rules-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { deepDifference } = require('@ibm-aca/aca-wrapper-obj-diff');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');
const { rulesAuditorService } = require('@ibm-aca/aca-auditor-service');
const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const { findOneById } = require('./find-one-by-id');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const runtimeDataService = require('../runtime-data');

const retrieveRuleChanges = async (context, ruleNewValue) => {
  const RULE_ID = ramda.path(['id'], ruleNewValue);
  let ruleCurrentValue;
  if (
    !lodash.isEmpty(RULE_ID)
  ) {
    ruleCurrentValue = await findOneById(context, { id: RULE_ID });
  }
  const RET_VAL = deepDifference(ruleCurrentValue, ruleNewValue);
  return {
    currentValue: ruleCurrentValue,
    diff: RET_VAL
  };
}

const _generateActionTitle = (params) => {
  const IS_NEW = lodash.isEmpty(params?.currentValue);
  const IS_IMPORT = params?.isImport || false;

  const IMPORT_PREFIX = IS_IMPORT ? 'IMPORT_' : '';
  const ACTION_TYPE = IS_NEW ? 'CREATE_ONE' : 'SAVE_ONE';

  const RET_VAL = IMPORT_PREFIX.concat(ACTION_TYPE);
  return RET_VAL;
}

const _saveOne = async (context, params) => {
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const RULE = ramda.path(['rule'], params);

  appendAuditInfo(context, RULE);
  const MESSAGE_NAME = ramda.path(['message', 'name'], RULE);
  RULE.status = { ...RULE.status, selectedMessageExists: true };
  if (lodash.isEmpty(MESSAGE_NAME)) {
    RULE.status = { ...RULE.status, selectedMessageExists: false };
  }


  const DOC_CHANGES = await retrieveRuleChanges(context, RULE);
  const RET_VAL = await DATASOURCE.rules.saveOne(context, params);

  await runtimeDataService.synchronizeWithConfigDirectoryRules(context, { value: RET_VAL })

  params.currentValue = DOC_CHANGES.currentValue;
  const ACTION_TYPE = _generateActionTitle(params);

  const AUDITOR_PARAMS = {
    action: ACTION_TYPE,
    docId: RET_VAL.id,
    docType: 'RULE',
    doc: RULE,
  };

  const IS_NEW = lodash.isEmpty(params?.currentValue);
  if (!IS_NEW) {
    AUDITOR_PARAMS.docChanges = DOC_CHANGES.diff;
  }

  await rulesAuditorService.saveOne(context, AUDITOR_PARAMS);
  getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.RESET_ENGINES, {});
  return RET_VAL;
}

const saveOne = async (context, params) => {
  try {

    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _saveOne, context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
}
