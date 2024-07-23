/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rule-actions-service-rules-actions-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getRuleActionsDatasource } = require('../datasource.utils');

const { saveOne: saveAuditRecord } = require('../actions-audits');

const _saveAuditRecord = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let doc;
  let value;
  try {
    doc = params?.doc;
    value = {
      action: 'EXPORT_MANY',
      docType: 'RULE_ACTIONS',
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

const exportMany = async (context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    try {
        const DATASOURCE = getRuleActionsDatasource(context);
        const RESULT = await DATASOURCE.actions.findManyByQuery(context, params);
        const RET_VAL = RESULT?.items;
        await _saveAuditRecords(context, RET_VAL);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
        logger.error(`${exportMany.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    exportMany,
}
