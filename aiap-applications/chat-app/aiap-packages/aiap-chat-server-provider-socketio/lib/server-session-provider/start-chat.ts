/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-start-chat';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  storeSession,
  reloadChatServerSessionProviderSession,
} from '@ibm-aca/aca-utils-session';

import {
  createTranscript,
  retrieveTranscript,
} from '@ibm-aca/aca-utils-transcript';

import {
  ChatServerV1SessionProviderSocketio
} from '.';

const _startChat = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
) => {
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    await chatServerSessionProvider.channel.startChat(chatServerSessionProvider.session);
    chatServerSessionProvider._resetToken();
    await storeSession(chatServerSessionProvider.session);
    await createTranscript(chatServerSessionProvider.session);
    const TRANSCRIPT = await retrieveTranscript(chatServerSessionProvider.session);
    const INIT_EVENT = {
      token: chatServerSessionProvider.session?.token?.value,
      transcript: TRANSCRIPT,
      session: chatServerSessionProvider.session, // TO_BE_REMOVED
    };
    chatServerSessionProvider.socket.emit('init', INIT_EVENT);

    await reloadChatServerSessionProviderSession(chatServerSessionProvider);

    await chatServerSessionProvider.sendOutgoingMessageAcaDebug(MODULE_ID, {
      session: chatServerSessionProvider?.session
    });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_startChat.name, { ACA_ERROR });
    await chatServerSessionProvider.emit('error', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _startChat,
}
