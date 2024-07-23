/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-rest-api-server-session-provider-start-chat';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  createTranscript,
} from '@ibm-aca/aca-utils-transcript';

import {
  storeSession
} from '@ibm-aca/aca-utils-session';

import {
  ChatRestV1SessionProvider
} from '.'

const _startChat = async (
  chatServerSessionProvider: ChatRestV1SessionProvider
) => {
  try {
    await chatServerSessionProvider.channel.startChat(chatServerSessionProvider?.session);
    await storeSession(chatServerSessionProvider?.session);
    await createTranscript(chatServerSessionProvider?.session);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_startChat.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _startChat
}
