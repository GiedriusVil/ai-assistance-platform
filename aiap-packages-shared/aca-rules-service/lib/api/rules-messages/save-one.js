/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-messages-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { deepDifference } = require('@ibm-aca/aca-wrapper-obj-diff');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');
const { messagesAuditorService } = require('@ibm-aca/aca-auditor-service');
const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const { findOneById } = require('./find-one-by-id');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');
const runtimeDataService = require('../runtime-data');

const retrieveMessageChanges = async (context, messageNewValue) => {
  const MESSAGE_ID = ramda.path(['id'], messageNewValue);
  let messageCurrentValue;
  if (
    !lodash.isEmpty(MESSAGE_ID)
  ) {
    messageCurrentValue = await findOneById(context, { id: MESSAGE_ID });
  }
  const RET_VAL = deepDifference(messageCurrentValue, messageNewValue);
  return {
    currentValue: messageCurrentValue,
    diff: RET_VAL
  };
}

const _generateActionTitle = (params) => {
  const IS_NEW = lodash.isEmpty(params?.currentValue);
  const IS_IMPORT = params?.auditIsImport || false;

  const IMPORT_PREFIX = IS_IMPORT ? 'IMPORT_' : '';
  const ACTION_TYPE = IS_NEW ? 'CREATE_ONE' : 'SAVE_ONE';

  const RET_VAL = IMPORT_PREFIX.concat(ACTION_TYPE);
  return RET_VAL;
}

const _saveOne = async (context, params) => {
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const MESSAGE = ramda.path(['message'], params);

  appendAuditInfo(context, MESSAGE);

  const DOC_CHANGES = await retrieveMessageChanges(context, MESSAGE);
  const RET_VAL = await DATASOURCE.rulesMessages.saveOne(context, params);

  await runtimeDataService.synchronizeWithConfigDirectoryRulesMessages(context, { value: RET_VAL })

  params.currentValue = DOC_CHANGES.currentValue;
  const ACTION_TYPE = _generateActionTitle(params);

  const AUDITOR_PARAMS = {
    action: ACTION_TYPE,
    docId: RET_VAL.id,
    docType: 'MESSAGE',
    doc: MESSAGE,
  };

  const IS_NEW = lodash.isEmpty(params?.currentValue);
  if (!IS_NEW) {
    AUDITOR_PARAMS.docChanges = DOC_CHANGES.diff;
  }

  await messagesAuditorService.saveOne(context, AUDITOR_PARAMS);
  const EVENT_STREAM = getEventStreamByContext(context);
  EVENT_STREAM.publish(AIAP_EVENT_TYPE.RESET_ENGINES, {});
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
