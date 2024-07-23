/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-bot-socketio-chat-events-inactivity';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

const send = (
  socket: any,
  message: any,
) => {
  try {
    const update = {
      type: 'inactivity',
      value: {
        message: message,
      },
    };
    socket.send({ chat_event: update });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { socket, message });
    logger.error(send.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  send,
}
