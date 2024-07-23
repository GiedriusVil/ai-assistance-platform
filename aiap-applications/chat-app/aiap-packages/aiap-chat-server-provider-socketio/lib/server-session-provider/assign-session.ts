/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-assign-session';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import { getTokenDecoded } from '@ibm-aca/aca-utils-socket';

import {
  retrieveStoredSession,
} from '@ibm-aca/aca-utils-session';

import {
  ChatServerV1SessionProviderSocketio
} from '.';

const _assignSession = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
) => {
  let jwtTokenDecoded;
  let session;
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    jwtTokenDecoded = getTokenDecoded(chatServerSessionProvider.socket);
    session = await retrieveStoredSession(jwtTokenDecoded);
    if (
      lodash.isEmpty(session)
    ) {
      const ERROR_MESSAGE = `Unable to retrieve session by JWT_TOKEN_DECODED!`;
      const DATA = {
        socket: {
          id: chatServerSessionProvider?.socket?.id,
        },
        jwtTokenDecoded: jwtTokenDecoded
      };
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, DATA);
    }
    chatServerSessionProvider.session = session;

    await chatServerSessionProvider.sendOutgoingMessageAcaDebug(MODULE_ID,
      {
        session,
      });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_assignSession.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  _assignSession,
}
