/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-utils-socket';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getTokenService } = require('@ibm-aiap/aiap-token-service');


const PARAM_NAME_X_ACA_CONV_TOKEN = 'x-aca-conversation-token';

const getToken = (socket) => {
  const HANDSHAKE = ramda.path(['handshake'], socket);
  if (!socket) {
    const MESSAGE = 'Passed socket is UNDEFINED || NULL!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
  }
  if (!HANDSHAKE) {
    const MESSAGE = 'Missing required socket.handshake parameter!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
  }
  const RET_VAL = HANDSHAKE.query[PARAM_NAME_X_ACA_CONV_TOKEN];
  return RET_VAL;
}

const getTokenDecoded = (socket) => {
  const CONV_TOKEN = getToken(socket);
  logger.info('CONV_TOKEN', { token: CONV_TOKEN });
  let retVal = undefined;
  if (CONV_TOKEN) {
    const TOKEN_SERVICE = getTokenService();
    retVal = TOKEN_SERVICE.verify(CONV_TOKEN);
  }
  return retVal;
}

const getConversationId = (socket) => {
  let retVal;
  let conversationTokenDecoded = getTokenDecoded(socket);
  if (conversationTokenDecoded) {
    try {
      retVal = conversationTokenDecoded.conversationId;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('Socketio server jwt.verify', { ACA_ERROR }); // [LEGO] - I am not sure I am getting this error catch!!!!
    }
  }
  return retVal;
}

module.exports = {
  getToken: getToken,
  getTokenDecoded: getTokenDecoded,
  getConversationId: getConversationId
}
