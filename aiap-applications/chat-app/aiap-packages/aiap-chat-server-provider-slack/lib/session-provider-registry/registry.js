/*
  © Copyright IBM Corporation 2022. All Rights Reserved.

  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-chat-server-provider-slack-session-provider-registry-get-registry`;
const logger = require(`@ibm-aca/aca-common-logger`)(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { acaSlackServerId } = require('../utils/aca-slack-server-id.utils');

const REGISTRY = {};

const getRegistry = () => {
  return REGISTRY;
}

const getSlackServerRegistry = (params) => {

  const SLACK_SERVER_ID = acaSlackServerId(params);
  let registry = getRegistry();
  let registrySlackServer = registry[SLACK_SERVER_ID];
  if (
    !registrySlackServer
  ) {
    registry[SLACK_SERVER_ID] = {};
    registrySlackServer = registry[SLACK_SERVER_ID];
  }
  return registrySlackServer;
}

const getSlackSessionProviderRegistry = (params) => {
  const CONVERSATION_ID = ramda.path(['conversationId'], params);
  let registrySlackServer;
  try {
    if (
      lodash.isEmpty(CONVERSATION_ID)
    ) {
      const MESSAGE = `Missing required params.conversationId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    registrySlackServer = getSlackServerRegistry(params);
    const RET_VAL = registrySlackServer;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('getSlackSessionProviderRegistry', { ACA_ERROR, });
    throw ACA_ERROR;
  }
}

module.exports = {
  getRegistry,
  getSlackSessionProviderRegistry,
}
