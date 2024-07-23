
/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-health-check-process-health-check-user-session-delete';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { destroySlackSessionProvider } = require('../session-provider-registry/destroy-slack-session-provider');

const processHealthCheckUserSessionDelete = async (params) => {
  const PROVIDER = ramda.path(['provider'], params);
  const PROVIDER_CONVERSATION_ID = ramda.path(['conversationId'], PROVIDER);
  const PROVIDER_TENANT = ramda.path(['tenant'], PROVIDER);
  const PROVIDER_ASSISTANT = ramda.path(['assistant'], PROVIDER);
  const PROVIDER_ENGAGEMENT = ramda.path(['engagement'], PROVIDER);

  try {
    if (
      lodash.isEmpty(PROVIDER_CONVERSATION_ID)
    ) {
      const MESSAGE = `Missing required params.provider.conversationId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    await destroySlackSessionProvider({
      conversationId: PROVIDER_CONVERSATION_ID,
      tenant: PROVIDER_TENANT,
      assistant: PROVIDER_ASSISTANT,
      engagement: PROVIDER_ENGAGEMENT,
    });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID });
    logger.error('processHealthCheckUserSessionDelete', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  processHealthCheckUserSessionDelete,
}
