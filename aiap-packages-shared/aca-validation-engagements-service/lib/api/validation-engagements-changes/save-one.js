/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'validation-engagements-service-validation-engagements-changes-changes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const { getDatasourceByContext } = require('./../datasource.utils');

const saveOne = async (context, params) => {
  try {
    const RECORD = params?.record;
    appendAuditInfo(context, RECORD);

    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.validationEngagementsChanges.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
