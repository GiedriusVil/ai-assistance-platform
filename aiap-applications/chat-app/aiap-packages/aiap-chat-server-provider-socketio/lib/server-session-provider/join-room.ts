/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-join-room';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  retrieveRoomId,
} from '@ibm-aca/aca-utils-session';

import {
  getChannelBySessionProviderAndChannelId,
} from '@ibm-aiap/aiap-chat-channel-provider';


import {
  ChatServerV1SessionProviderSocketio
} from '.';


const _joinRoom = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
) => {
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const ROOM_ID = retrieveRoomId(chatServerSessionProvider.session);
    await chatServerSessionProvider.socket.join(ROOM_ID);
    logger.info(_joinRoom.name,
      {
        ROOM_ID
      });

    chatServerSessionProvider.session.room = { id: ROOM_ID };
    const STORED_CHANNEL = chatServerSessionProvider.session?.channel;

    let hasToStartChat = false;
    if (
      lodash.isEmpty(STORED_CHANNEL)
    ) {
      hasToStartChat = true;
      chatServerSessionProvider.__assignDefaultChatChannelId();
    }
    chatServerSessionProvider.channel = getChannelBySessionProviderAndChannelId(
      chatServerSessionProvider,
      chatServerSessionProvider.session.channel.id
    );
    logger.info(_joinRoom.name,
      {
        this_channel_type: chatServerSessionProvider.channel.type,
      });

    if (
      hasToStartChat
    ) {
      await chatServerSessionProvider.startChat();
    } else {
      await chatServerSessionProvider.continueChat();
    }
    const ROOM = chatServerSessionProvider.server.getRoom(ROOM_ID);
    logger.info(_joinRoom.name,
      {
        this_channel_type: chatServerSessionProvider.channel.type,
        roomId: ROOM_ID,
        room: lodash.isSet(ROOM) ? Array.from(ROOM) : ROOM,
      });

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_joinRoom.name, { ACA_ERROR });
    await chatServerSessionProvider.emit('error', { ACA_ERROR });
  }

}


export {
  _joinRoom,
}
