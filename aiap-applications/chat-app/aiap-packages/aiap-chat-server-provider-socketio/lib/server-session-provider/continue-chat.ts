/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-continue-chat';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

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
  retrieveTranscript,
  retrieveLeftPanelState,
} from '@ibm-aca/aca-utils-transcript';

import {
  ChatServerV1SessionProviderSocketio
} from '.';

const _continueChat = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
) => {
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    await chatServerSessionProvider.channel.continueChat(chatServerSessionProvider.session);
    chatServerSessionProvider._resetToken();
    await storeSession(chatServerSessionProvider.session);

    const TRANSCRIPT = await retrieveTranscript(chatServerSessionProvider.session);
    const LEFT_PANEL = await retrieveLeftPanelState(chatServerSessionProvider.session);

    const ACTIONS = chatServerSessionProvider.session?.actions;

    const CONTINUE_EVENT = {
      token: chatServerSessionProvider.session?.token?.value,
      transcript: TRANSCRIPT,
      leftPanel: LEFT_PANEL,
      session: chatServerSessionProvider.session, // TO_BE_REMOVED
    };

    await reloadChatServerSessionProviderSession(chatServerSessionProvider);

    chatServerSessionProvider.socket.emit('continue', CONTINUE_EVENT);

    if (
      !lodash.isEmpty(ACTIONS)
    ) {
      const SENDER_ACTION = ACTIONS?.sender_action;
      chatServerSessionProvider.session.channel.id = SENDER_ACTION?.channelId;
      chatServerSessionProvider._resetToken();
      const MESSAGE = {
        session: chatServerSessionProvider.session,
        sender_action: SENDER_ACTION
      };
      const TYPE = SENDER_ACTION?.type;
      chatServerSessionProvider.socket.emit(`${TYPE}`, MESSAGE);
    }


    await chatServerSessionProvider.sendOutgoingMessageAcaDebug(MODULE_ID, {
      session: chatServerSessionProvider?.session
    });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_continueChat.name, { ACA_ERROR });
    await chatServerSessionProvider.emit('error', { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  _continueChat,
}
