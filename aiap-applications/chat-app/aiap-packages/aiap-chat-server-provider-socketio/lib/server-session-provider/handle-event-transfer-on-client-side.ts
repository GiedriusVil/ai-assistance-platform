/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-handle-transfer-event-on-client-side';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  storeSession,
} from '@ibm-aca/aca-utils-session';

import {
  IChatMessageV1,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  ChatServerV1SessionProviderSocketio
} from '.';

const _handleEventTransferOnClientSide = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
  message: IChatMessageV1,
) => {
  const MESSAGE_SENDER_ACTION = message?.sender_action;
  const MESSAGE_SENDER_ACTION_CHANNEL_ID = MESSAGE_SENDER_ACTION?.channelId;
  const MESSAGE_SENDER_ACTION_API_KEY = MESSAGE_SENDER_ACTION?.apikey;
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(MESSAGE_SENDER_ACTION)
    ) {
      const ERROR_MESSAGE = `Missing required message.sender_action parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(MESSAGE_SENDER_ACTION_CHANNEL_ID)
    ) {
      const ERROR_MESSAGE = `Missing required message.sender_action.channelId!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(MESSAGE_SENDER_ACTION_API_KEY)
    ) {
      const ERROR_MESSAGE = `Missing required message.sender_action.apikey!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    delete message.message; // -> We need ability to send action messages from ochestrator without any text!
    message.type = 'bot';
    message.session = chatServerSessionProvider.session;
    //await this.sendOutgoingMessage(message);
    chatServerSessionProvider.session.channel.id = MESSAGE_SENDER_ACTION_CHANNEL_ID;
    chatServerSessionProvider._resetToken();
    await storeSession(chatServerSessionProvider.session);
    // await this.channel.disconnect();
    chatServerSessionProvider.socket.emit('transfer_on_client_side', message);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_handleEventTransferOnClientSide.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _handleEventTransferOnClientSide,
}
