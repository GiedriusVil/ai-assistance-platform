/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-service-classification-rules-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getClassificationRulesDatasource, getFindManyQuery } = require('../datasource.utils');
const { formatIntoAcaError, appendDataToError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { saveOne: saveAuditRecord } = require('../rules-audits');

const _saveAuditRecord = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let doc;
  let value;
  try {
    doc = params?.doc;
    value = {
      action: 'EXPORT_MANY',
      docType: 'CLASSIFICATION_RULES',
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
        const DATASOURCE = getClassificationRulesDatasource(context);
        const RESULT = await DATASOURCE.rules.findManyByQuery(context, params);
        const RULES = RESULT?.items;

        for (const RULE of RULES) {
            const RULE_ID = RULE?.id;
            const QUERY = getFindManyQuery({ ruleId: RULE_ID });
            const CONDITIONS = await DATASOURCE.rulesConditions.findManyByQuery(context, QUERY);
            RULE['conditions'] = ramda.pathOr([], ['items'], CONDITIONS); 
            const CLASSIFICATIONS = await DATASOURCE.rulesClassifications.findManyByQuery(context, QUERY);
            RULE['classifications'] = ramda.pathOr([], ['items'], CLASSIFICATIONS); 
        }
        const RET_VAL = ramda.path(['items'], RESULT);
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
