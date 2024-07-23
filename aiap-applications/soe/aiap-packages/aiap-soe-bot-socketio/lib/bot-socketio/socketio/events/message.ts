/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-bot-socketio-socketio-events-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import * as chatEventsProcessor from './chat-events/processor';
import * as senderActionProcessor from './sender-action/processor';

const onMessageCallback = (
  socket,
  adapter
) => {
  const RET_VAL = async (message) => {
    try {
      if (
        message == null ||
        typeof message !== 'object'
      ) {
        const err = {
          message: `Expected JSON object but got '${typeof message}' ${message} instead`,
        };
        return adapter.emit('error', err);
      }
      if (
        message.sender_action
      ) {
        return senderActionProcessor.process(socket, adapter, message.sender_action);
      }
      if (
        message.chat_event
      ) {
        return chatEventsProcessor.process(socket, adapter, message.chat_event);
      }
      const clientId = adapter.getClientId(socket);
      const clientActivity = await adapter.utilsActivity.getClientActivity(clientId);
      if (
        adapter.utilsActivity.isChatInClosingState(clientActivity)
      ) {
        return;
      }
      adapter.utilsActivity.updateClientActivity(clientId, clientActivity);

      //Remove client data
      const rawUpdate = ramda.omit(['client'], message);

      rawUpdate.socket = socket;

      const update = adapter.__formatUpdate(rawUpdate, clientId);

      //Assign client data
      const clientDataProfile = message?.client?.profile;

      if (
        clientDataProfile != null
      ) {
        update.private = ramda.assoc(['profile'], clientDataProfile, update.private);
      }

      const clientDataMetadata = ramda.path(['client', 'metadata'], message);

      if (
        clientDataMetadata != null
      ) {
        update.metadata = ramda.assoc(['metadata'], clientDataMetadata, update.metadata);
      }

      (update.source = message.source ? message.source.toUpperCase() : null),
        adapter.utilsTyping.updateTypingStatus(clientId);

      const TMP_RET_VAL = adapter.__emitUpdate(update);
      return TMP_RET_VAL;

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(onMessageCallback.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  };
  return RET_VAL;
};

export {
  onMessageCallback,
}
