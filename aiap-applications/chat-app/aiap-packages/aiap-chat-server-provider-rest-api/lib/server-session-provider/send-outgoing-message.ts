/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-rest-api-server-session-provider-send-outgoing-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  processOutgoingMessage
} from '../processor-outgoing-message';

import {
  ChatRestV1SessionProvider
} from '.'

const _sendOutgoingMessage = async (
  chatServerSessionProvider: ChatRestV1SessionProvider,
  message: any
) => {
  try {
    const CONTEXT = { provider: chatServerSessionProvider };
    const PARAMS = { message };
    await processOutgoingMessage(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { message });
    logger.error(_sendOutgoingMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _sendOutgoingMessage
}
