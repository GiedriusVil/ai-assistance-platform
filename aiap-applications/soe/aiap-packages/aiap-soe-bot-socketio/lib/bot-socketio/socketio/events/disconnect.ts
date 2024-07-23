/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-bot-socketio-socketio-events-disconnect';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

const onDisconnectCallback = (
  socket,
  adapter,
) => {
  const RET_VAL = () => {
    try {
      const clientId = adapter.getClientId(socket);
      logger.debug(`socket with id: ${socket.id} disconnected`);
      //On disconnect remove client data from adapter
      adapter.clientCleanupFromAdapter(clientId);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(onDisconnectCallback.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
  return RET_VAL;
}

export {
  onDisconnectCallback,
}
