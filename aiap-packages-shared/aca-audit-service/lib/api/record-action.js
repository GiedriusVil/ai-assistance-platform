/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-audit-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');
const { AuditRecord } = require('./audit-record-helper');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const recordAction = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const CONTEXT_USER = context?.user;
  const CONTEXT_USER_NAME = context?.user?.username;

  const ACTION = params?.record?.action;
  const DOCUMENT_ID = params?.record?.docId;
  const DOCUMENT_TYPE = params?.record?.docType;
  try {
    if (
      lodash.isEmpty(CONTEXT_USER)
    ) {
      const MESSAGE = `Missing required context.user parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(CONTEXT_USER_NAME)
    ) {
      const MESSAGE = `Missing required context.user.username parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ACTION)
    ) {
      const MESSAGE = `Missing required params.record.action parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(DOCUMENT_ID)) {
      const MESSAGE = `Missing required params.record.docId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(DOCUMENT_TYPE)) {
      const MESSAGE = `Missing required params.record.docType parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const RECORD = new AuditRecord.builder(DOCUMENT_TYPE)
      .byUserId(CONTEXT_USER_NAME)
      .onAction(ACTION)
      .withExternalId(DOCUMENT_ID)
      .build();

    const DATA_SOURCE = getDatasourceV1App();
    await DATA_SOURCE.audits.createOne(context, { record: RECORD });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(recordAction.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  recordAction
}
