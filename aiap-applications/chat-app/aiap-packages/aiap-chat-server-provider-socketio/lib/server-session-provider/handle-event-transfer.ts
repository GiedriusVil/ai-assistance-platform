/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-handle-event-transfer';
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
  storeSession,
} from '@ibm-aca/aca-utils-session';

import { getChannelBySessionProviderAndChannelId } from '@ibm-aiap/aiap-chat-channel-provider';

import {
  ChatServerV1SessionProviderSocketio
} from '.';

const _handleEventTransfer = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
  message: IChatMessageV1,
) => {
  let senderAction;
  let senderActionChannelId;
  let senderActionSkill;
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(message?.sender_action)
    ) {
      const ERROR_MESSAGE = `Missing required message?.sender_action parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(message?.sender_action?.channelId)
    ) {
      const ERROR_MESSAGE = `Missing required message?.sender_action?.channelId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(message?.sender_action?.skill)
    ) {
      const ERROR_MESSAGE = `Missing required message?.sender_action?.skillId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    senderAction = message?.sender_action;
    senderActionChannelId = message?.sender_action?.channelId;
    senderActionSkill = message?.sender_action?.skill;

    console.log(MODULE_ID, {
      senderAction,
      senderActionChannelId,
      senderActionSkill,
    });

    const CHANNEL = getChannelBySessionProviderAndChannelId(chatServerSessionProvider, senderActionChannelId);
    if (
      !CHANNEL
    ) {
      const ERROR_MESSAGE = `Unable to retrieve channel by channel_id: ${senderActionChannelId}`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    delete message.message; // -> We need ability to send action messages from ochestrator without any text!
    message.type = 'bot';
    message.session = chatServerSessionProvider.session;

    const CHANNEL_CONV_ID = await CHANNEL.startChat(chatServerSessionProvider.session, true);

    chatServerSessionProvider.session.channel.id = senderActionChannelId;
    chatServerSessionProvider.session.channel.convId = CHANNEL_CONV_ID;

    chatServerSessionProvider._resetToken();
    await storeSession(chatServerSessionProvider.session);

    const TRANSFER_TO_CHANNEL_EVENT = {
      session: chatServerSessionProvider.session,
    };
    await chatServerSessionProvider.channel.disconnect();
    chatServerSessionProvider.channel = CHANNEL;
    chatServerSessionProvider.socket.emit('transfer_to_channel', TRANSFER_TO_CHANNEL_EVENT);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_handleEventTransfer.name, { ACA_ERROR });
    await chatServerSessionProvider.sendOutgoingMessageAcaError(MODULE_ID, ACA_ERROR);
  }
}

export {
  _handleEventTransfer,
}
