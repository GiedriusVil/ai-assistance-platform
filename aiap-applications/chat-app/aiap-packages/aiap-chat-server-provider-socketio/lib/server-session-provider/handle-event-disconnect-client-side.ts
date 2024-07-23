/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-handle-event-disconnect-client-side';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ChatServerV1SessionProviderSocketio
} from '.';

const _handleEventDisconnectClientSide = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
) => {
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isEmpty(chatServerSessionProvider.channel)
    ) {
      await chatServerSessionProvider.channel.handleClientSideDisconnect();
    }
    if (
      !lodash.isEmpty(chatServerSessionProvider.eventEmitterSTT)
    ) {
      const CONVERSAION_ID = chatServerSessionProvider.session?.conversation?.id;
      chatServerSessionProvider.eventEmitterSTT.unsubscribe(CONVERSAION_ID);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_handleEventDisconnectClientSide.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _handleEventDisconnectClientSide,
}
