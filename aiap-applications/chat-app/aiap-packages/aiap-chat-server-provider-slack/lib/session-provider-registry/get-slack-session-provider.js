/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-chat-server-provider-slack-session-provider-registry-get-slack-session-provider`;
const logger = require(`@ibm-aca/aca-common-logger`)(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { isSessionValid, deleteSession, isSessionExpired } = require('@ibm-aca/aca-utils-session');
const { getSlackSessionProviderRegistry } = require('./registry');
const { SlackSessionProvider } = require('../session-provider');

const getSlackSessionProvider = async (params) => {
  const CONVERSATION_ID = params?.conversationId;
  const MESSAGE_TIMESTAMP = params?.messageTimestamp;
  const MESSAGE_TIMESTAMP_PARSED = Number.parseInt(MESSAGE_TIMESTAMP);

  let providerRegistry;
  let provider;
  try {
    if (
      lodash.isEmpty(CONVERSATION_ID)
    ) {
      const MESSAGE = `Missing required params.conversationId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    providerRegistry = getSlackSessionProviderRegistry(params);
    provider = providerRegistry[CONVERSATION_ID];

    if (
      lodash.isEmpty(provider)
    ) {
      provider = await SlackSessionProvider.getInstance(params);
      providerRegistry[CONVERSATION_ID] = provider;
    } else {
      const IS_SESSION_VALID = await isSessionValid(provider?.session);
      const SESSION_EXPIRING_PARAMS = {
        session: provider?.session,
        messageTimestamp: MESSAGE_TIMESTAMP_PARSED
      };
      const IS_SESSION_EXPIRED = await isSessionExpired(SESSION_EXPIRING_PARAMS);
      if (
        !IS_SESSION_VALID ||
        IS_SESSION_EXPIRED
      ) {
        await deleteSession(provider?.session);
        await provider.initialise();
      }
    }
    logger.info(`${MODULE_ID} --> getSlackSessionProvider`, { providerRegistry, MESSAGE_TIMESTAMP_PARSED });
    await provider.updateSessionExpirationTime(MESSAGE_TIMESTAMP_PARSED);
    const RET_VAL = provider;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONVERSATION_ID, providerRegistry, provider });
    logger.error('getSlackSessionProvider', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getSlackSessionProvider,
}
