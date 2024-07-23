/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-handle-event-clear-event';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ChatServerV1SessionProviderSocketio
} from '.';

const _handleEventClearRoom = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
  event: any,
) => {
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    await chatServerSessionProvider.disconnectFromChannel();
    chatServerSessionProvider.socket.disconnect();
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_handleEventClearRoom.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _handleEventClearRoom,
}
