/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rule-actions-service-actions-audits-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getRuleActionsDatasource } = require('../datasource.utils');

const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const saveOne = async (context, params) => {
  try {
    appendAuditInfo(context, params?.value);
    if (
      params?.value
    ) {
      params.value.actionId = context?.action?.id;
    }
    const DATASOURCE = getRuleActionsDatasource(context);
    const RET_VAL = await DATASOURCE.actionsAudits.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};


module.exports = {
  saveOne,
}
