/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-chat-server-provider-slack-session-provider-registry-destroy-slack-session-provider`;
const logger = require(`@ibm-aca/aca-common-logger`)(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getSlackSessionProviderRegistry } = require('./registry');

const destroySlackSessionProvider = async (params) => {
  const CONVERSATION_ID = ramda.path(['conversationId'], params);

  let registrySlackSessionProvider;
  let slackSesionProvider;
  try {
    if (
      lodash.isEmpty(CONVERSATION_ID)
    ) {
      const MESSAGE = `Missing required params.conversationId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    registrySlackSessionProvider = getSlackSessionProviderRegistry(params);

    if (
      registrySlackSessionProvider
    ) {
      slackSesionProvider = registrySlackSessionProvider[CONVERSATION_ID];
      if (
        slackSesionProvider
      ) {
        await slackSesionProvider.disconnect();
        delete registrySlackSessionProvider[CONVERSATION_ID];
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONVERSATION_ID });
    logger.error('destroySlackSessionProvider', { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  destroySlackSessionProvider,
}
