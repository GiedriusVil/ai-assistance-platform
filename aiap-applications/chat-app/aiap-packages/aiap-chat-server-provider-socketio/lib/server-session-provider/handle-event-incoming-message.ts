/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-handle-event-incoming-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IChatMessageV1,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  addMessageToTranscript,
} from '@ibm-aca/aca-utils-transcript';

import {
  resetMessageGAcaPropsUserBySession,
  resetMessageGAcaPropsUserProfileBySession,
} from '../../chat-message-utils';

import {
  ChatServerV1SessionProviderSocketio,
} from '.';

const _handleEventIncomingMessage = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
  message: IChatMessageV1,
) => {
  let conversationId;
  let isAudioMuted;
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    conversationId = chatServerSessionProvider?.session?.conversation?.id;
    isAudioMuted = message?.message?.audioMuted;
    if (
      !chatServerSessionProvider.channel
    ) {
      const MESSAGE = `Conversation channel is missing! [CONV_ID: ${conversationId}]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if(
      lodash.isBoolean(isAudioMuted) 
    ) {
      chatServerSessionProvider.session.isAudioMuted = isAudioMuted;
    }
    logger.info(_handleEventIncomingMessage.name,
      {
        conversationId
      });

    resetMessageGAcaPropsUserBySession(
      message,
      chatServerSessionProvider?.session,
    );
    resetMessageGAcaPropsUserProfileBySession(
      message,
      chatServerSessionProvider?.session,
    );
    await chatServerSessionProvider.channel.sendMessage(message);
    await addMessageToTranscript(chatServerSessionProvider.session, message);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_handleEventIncomingMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _handleEventIncomingMessage,
}
