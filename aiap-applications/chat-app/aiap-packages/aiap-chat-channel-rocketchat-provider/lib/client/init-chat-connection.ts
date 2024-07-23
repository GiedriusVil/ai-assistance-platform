/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-channel-rocketchat-provider-client-init-chat-connection';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import WebSocket from 'ws';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

const initChatConnection = async (params) => {

  try {

    const CONFIGURATION = params?.configurations;
    const SOCKET_CONNECTION_HOST = CONFIGURATION?.external?.websocket?.host;
    const SOCKET_CONNECTION_PORT = CONFIGURATION?.external?.websocket?.port;
    const SOCKET_CONNECTION_PATH = CONFIGURATION?.external?.websocket?.path;

    if (lodash.isEmpty(SOCKET_CONNECTION_HOST)) {
      const MESSAGE = `Missing required configuration.external.websocket.host!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(SOCKET_CONNECTION_PATH)) {
      const MESSAGE = `Missing required configuration.external.websocket.path!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const SOCKET_CONNECTION_URI = `${SOCKET_CONNECTION_HOST}:${SOCKET_CONNECTION_PORT}${SOCKET_CONNECTION_PATH}`;

    const SOCKET = new WebSocket(SOCKET_CONNECTION_URI);
  
    return SOCKET;
    
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initChatConnection.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
export {
  initChatConnection,
}
