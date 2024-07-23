/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-handle-event-transfer-to-bot';
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

import {
  ChatServerV1SessionProviderSocketio
} from '.';

const _handleEventTransferToBot = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
  message: IChatMessageV1,
) => {
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const TRANSFER_TO_BOT = message.sender_action;
    const CHANNEL_ID = message?.sender_action?.channelId;
    const MESSAGE = message?.sender_action?.message;
    if (
      lodash.isEmpty(TRANSFER_TO_BOT)
    ) {
      const ERROR_MESSAGE = `Unable to transfer [transferAction: ${TRANSFER_TO_BOT}]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(CHANNEL_ID)
    ) {
      const ERROR_MESSAGE = `Unable to transfer [CHANNEL_ID: ${CHANNEL_ID}]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(MESSAGE)
    ) {
      const ERROR_MESSAGE = `Unable to transfer [MESSAGE: ${MESSAGE}]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    logger.info(`[TRANSFER_ON_CLIENT_SIDE] Transfering to another channel!`, TRANSFER_TO_BOT);
    message.message.text = MESSAGE;
    message.type = 'bot';
    message.session = chatServerSessionProvider.session;

    chatServerSessionProvider.session.channel.id = CHANNEL_ID;
    chatServerSessionProvider._resetToken();
    await storeSession(chatServerSessionProvider.session);
    chatServerSessionProvider.socket.emit('transfer_to_bot', message);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_handleEventTransferToBot.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _handleEventTransferToBot,
}
