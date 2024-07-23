/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-send-outgoing-message-aca-error';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


import { uuidv4 } from '@ibm-aca/aca-wrapper-uuid';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IChatMessageV1,
  MESSAGE_TYPE,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  ChatServerV1SessionProviderSocketio,
} from '.';

const _sendOutgoingMessageAcaError = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
  moduleId: string,
  error: any,
) => {
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const SESSION = chatServerSessionProvider.session;
    const IS_ENABLED = SESSION.engagement.chatApp.notifications[MESSAGE_TYPE.ACA_ERROR];

    if(!IS_ENABLED) return;

    const MESSAGE_ERROR: IChatMessageV1 = {
      id: uuidv4(),
      type: 'ACA_ERROR',
      message: {
        text: `[ERROR_MESSAGE] ${moduleId}`,
        attachment: {
          type: 'ACA_ERROR',
          data: error
        }
      }
    };
    
    await chatServerSessionProvider.sendOutgoingMessage(MESSAGE_ERROR);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_sendOutgoingMessageAcaError.name, { ACA_ERROR });
  }
}

export {
  _sendOutgoingMessageAcaError,
}
