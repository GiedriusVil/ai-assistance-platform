/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-chat-server-provider-slack-utils-aca-slack-server-id`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const acaSlackServerId = (params) => {
  const TENANT_ID = ramda.path(['tenant', 'id'], params);
  const ENGAGEMENT_ID = ramda.path(['engagement', 'id'], params);
  const ENGAGEMENT_ASSISTANT_ID = ramda.path(['assistant', 'id'], params);
  try {
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required params.tenant.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE)
    }
    if (
      lodash.isEmpty(ENGAGEMENT_ID)
    ) {
      const MESSAGE = `Missing required params.engagement.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE)
    }
    if (
      lodash.isEmpty(ENGAGEMENT_ASSISTANT_ID)
    ) {
      const MESSAGE = `Missing required params.engagement.assistant.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE)
    }
    const RET_VAL = `${TENANT_ID}:${ENGAGEMENT_ASSISTANT_ID}:${ENGAGEMENT_ID}`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { TENANT_ID, ENGAGEMENT_ASSISTANT_ID, ENGAGEMENT_ID });
    throw ACA_ERROR
  }
}

module.exports = {
  acaSlackServerId,
};
