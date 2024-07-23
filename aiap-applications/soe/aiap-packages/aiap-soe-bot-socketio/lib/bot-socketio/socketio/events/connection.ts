/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-bot-socketio-socketio-events-connection';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import { onMessageCallback } from './message';
import { onDisconnectCallback } from './disconnect';

const onConnectionCallback = (
  adapter: any,
) => {
  const RET_VAL = async (socket) => {
    try {

      // 2021-07-07 Let's see if this will help!
      const CLIENT_ID = adapter.getClientId(socket);
      socket.join(CLIENT_ID);
      logger.info(`New socket.io connection! [socket_id: ${socket.id}, client_id: ${CLIENT_ID}]`);
      adapter.setClientSocketId(CLIENT_ID, socket.id);

      //Bind to events first to avoid memory leak
      socket.on('message', await onMessageCallback(socket, adapter));
      socket.on('disconnect', await onDisconnectCallback(socket, adapter));

      //Update typing status to false
      adapter.utilsTyping.setTypingStatus(CLIENT_ID, false);

      const clientActivity = await adapter.utilsActivity.getClientActivity(CLIENT_ID);

      //Check if chat is not closed
      if (
        !adapter.utilsActivity.isChatClosed(clientActivity)
      ) {
        if (
          adapter.utilsActivity.isChatInClosingState(clientActivity)
        ) {
          //If chat is in closing state, update close timer
          adapter.utilsActivity.updateClosingStateTimers(CLIENT_ID, clientActivity);
        } else {
          //If chat is not in closing state
          if (
            ramda.isEmpty(clientActivity)
          ) {
            //Check if chat sesion is new - avoid disconnects from browser. Create new sesion activity
            adapter.utilsActivity.updateClientActivity(CLIENT_ID, clientActivity);
          } else {
            //If activity is existing (returning client), update timers only
            adapter.utilsActivity.updateClientActivityTimers(CLIENT_ID, clientActivity);
          }
        }
      }

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(onConnectionCallback.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  };

  return RET_VAL;
};

export {
  onConnectionCallback,
}
