/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-service-rules-conditions-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getBuyRulesDatasource } = require('../datasource.utils');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');
const { calcDiffByValue } = require('./calc-diff-by-value');

const { saveOne: saveAuditRecord } = require('../rules-audits');

const _saveAuditRecord = async (context, params, options) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let doc;
  let docChanges;
  let value;
  let action;
  try {
    doc = params?.doc;
    docChanges = params?.docChanges;
    action = options?.action;
    value = {
      action: action,
      docType: 'BUY_RULE_CONDITIONS',
      doc: doc,
      docChanges: docChanges,
    }
    await saveAuditRecord(context, { value });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, value });
    logger.error(`${_saveAuditRecord.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _saveOne = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    const DATASOURCE = getBuyRulesDatasource(context);
    const RET_VAL = await DATASOURCE.rulesConditions.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(`${_saveOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const saveOne = async (context, params, options = { action: 'SAVE_ONE' }) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let value;
  let valueChanges;
  try {
    value = params?.value;
    appendAuditInfo(context, params?.value);
    valueChanges = await calcDiffByValue(context, { value });
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _saveOne, context, params);
    await _saveAuditRecord(context, { doc: RET_VAL, docChanges: valueChanges }, options);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(`${saveOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
}
