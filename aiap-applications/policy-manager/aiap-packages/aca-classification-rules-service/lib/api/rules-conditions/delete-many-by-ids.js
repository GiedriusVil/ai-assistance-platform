/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-service-classification-rule-conditions-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getClassificationRulesDatasource } = require('../datasource.utils');
const { formatIntoAcaError, appendDataToError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const { saveOne: saveAuditRecord } = require('../rules-audits');
const { findOneById } = require('./find-one-by-id');

const _saveAuditRecord = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let doc;
  let value;
  try {
    doc = params?.doc;
    value = {
      action: 'DELETE_MANY_BY_IDS',
      docType: 'CLASSIFICATION_RULE_CONDITIONS',
      doc: doc,
    }
    await saveAuditRecord(context, { value });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, value });
    logger.error(`${_saveAuditRecord.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _saveAuditRecords = async (context, docs) => {
  const CONTEXT_USER_ID = context?.user?.id;

  try {
    if (
      !lodash.isArray(docs)
    ) {
      const MESSAGE = `Wrong type of docs parameter! [Expected: Array]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (let doc of docs) {
      PROMISES.push(_saveAuditRecord(context, { doc }))
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(`${_saveAuditRecords.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _retrieveConditions = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const PARAMS_IDS = params?.ids;
  try {
    if (
      !lodash.isArray(PARAMS_IDS)
    ) {
      const MESSAGE = `Wrong type of ids parameter! [Expected: Array]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (let id of PARAMS_IDS) {
      PROMISES.push(findOneById(context, { id }));
    }
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(`${_retrieveConditions.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _deleteManyByIds = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    const DATASOURCE = getClassificationRulesDatasource(context);
    const RET_VAL = await DATASOURCE.rulesConditions.deleteManyByIds(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(`${_deleteManyByIds.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const deleteManyByIds = async (context, params) => {
  const CONTEX_USER_ID = context?.user?.id;
  let conditions;
  try {
    conditions = await _retrieveConditions(context, params);
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _deleteManyByIds, context, params);
    await _saveAuditRecords(context, conditions);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEX_USER_ID });
    logger.error(`${deleteManyByIds.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
    deleteManyByIds,
}
