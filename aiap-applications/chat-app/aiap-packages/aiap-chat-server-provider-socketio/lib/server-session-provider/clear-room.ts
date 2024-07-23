/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-clear-room';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ChatServerV1SessionProviderSocketio
} from '.';

const _clearRoom = (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
) => {
  const ROOM_ID = chatServerSessionProvider.session?.room?.id;
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isEmpty(ROOM_ID)
    ) {
      const MESSAGE = {
        type: 'clear_room',
        room: {
          id: ROOM_ID,
        },
      };
      logger.info('_clearRoom', {
        ROOM_ID,
        MESSAGE
      });
      chatServerSessionProvider.socket.to(ROOM_ID).emit('clear_room', MESSAGE);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { ROOM_ID });
    logger.error(_clearRoom.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  _clearRoom,
}
