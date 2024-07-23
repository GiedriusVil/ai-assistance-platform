/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-service-models-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const saveOne = async (context, params) => {
  try {
    const AUDIT_RECORD = {
      action: params?.action,
      docType: params?.docType || 'CLASSIFIER MODEL',
      docId: params?.value?.id,
      docName: params?.value?.name || params?.value?.id,
      doc: params?.value,
      docChanges: params?.docChanges || [],
      context: context,
      timestamp: new Date(),
    }

    const DATASOURCE = getDatasourceByContext(context);
    appendAuditInfo(context, AUDIT_RECORD);
    const RET_VAL = await DATASOURCE.classifierModelsChanges.saveOne(context, { value: AUDIT_RECORD });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
