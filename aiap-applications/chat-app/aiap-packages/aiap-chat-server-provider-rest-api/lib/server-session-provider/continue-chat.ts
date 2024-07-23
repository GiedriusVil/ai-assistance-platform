/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-rest-api-server-session-provider-continue-chat';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  storeSession,
  refreshToken
} from '@ibm-aca/aca-utils-session';

import {
  ChatRestV1SessionProvider
} from '.'

const _continueChat = async (
  chatServerSessionProvider: ChatRestV1SessionProvider
) => {
  try {
    await chatServerSessionProvider.channel.continueChat(chatServerSessionProvider?.session);
    refreshToken(chatServerSessionProvider);
    await storeSession(chatServerSessionProvider?.session);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('continueChat', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _continueChat
}
