/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-rest-api-server-session-provider-handle-event-incoming-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  storeSession,
  refreshToken
} from '@ibm-aca/aca-utils-session';

import {
  addMessageToTranscript,
} from '@ibm-aca/aca-utils-transcript';

import {
  _resetMessageGAcaPropsUser,
  _resetMessageGAcaPropsUserProfile,
  _ensureMessageGAcaPropsExistance,
  _resetChannelMeta
} from '../chat-message-utils';

import {
  ChatRestV1SessionProvider
} from '.'

const _handleIncomingMessageEvent = async (
  chatServerSessionProvider: ChatRestV1SessionProvider,
  message: any
) => {
  try {
    const MESSAGE = {
      message: {
        text: message?.text
      },
      gAcaProps: chatServerSessionProvider?.gAcaProps,
      engagement: chatServerSessionProvider?.session?.engagement
    };
    _resetMessageGAcaPropsUser(
      MESSAGE,
      chatServerSessionProvider?.session
    );
    _resetMessageGAcaPropsUserProfile(
      MESSAGE,
      chatServerSessionProvider?.session
    );
    _resetChannelMeta(
      MESSAGE,
      chatServerSessionProvider?.session
    )
    await chatServerSessionProvider.channel.sendMessage(MESSAGE);
    await addMessageToTranscript(chatServerSessionProvider.session, MESSAGE);

    chatServerSessionProvider.session.isNew = false;
    await storeSession(chatServerSessionProvider.session);

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { message });
    logger.error(_handleIncomingMessageEvent.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _handleIncomingMessageEvent
}
