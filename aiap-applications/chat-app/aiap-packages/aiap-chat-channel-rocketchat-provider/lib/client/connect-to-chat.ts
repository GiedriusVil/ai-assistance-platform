/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-channel-rocketchat-provider-client-connect-to-chat';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import uuid from 'uuid/v4';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  retrieveStoredSession
} from '@ibm-aca/aca-utils-session';

import {
  ChatChannelV1Rocketchat
} from '../channel'

const connectUserToChat = async (
  channel:ChatChannelV1Rocketchat ,
  session: any
) => {

  let messagesCount = 1;

  const STORED_SESSION = await retrieveStoredSession(session);
  const ROCKETCHAT_SESSION = STORED_SESSION?.channel?.rocketchat;
  const CHAT_TOKEN = ROCKETCHAT_SESSION?.chatToken;
  const CHAT_ROOM_ID = ROCKETCHAT_SESSION?.chatRoomId;
  const ROOM_SUBSCRIBE_ID = ROCKETCHAT_SESSION?.roomSubscribeId;
  const STREAM_LIVECHAT_SUBSCRIBE_ID = ROCKETCHAT_SESSION?.streamLivechatSubscribeId;
  const USER_PROFILE = STORED_SESSION?.userProfile;
  const USER_PROFILE_EMAIL = USER_PROFILE?.email;
  const USER_PROFILE_FULL_NAME = USER_PROFILE?.fullName ?? 'Rocketchat-user';

  try {

    if (lodash.isEmpty(ROCKETCHAT_SESSION)) {
      const MESSAGE = `Missing required rocketchat session!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(CHAT_TOKEN)) {
      const MESSAGE = `Missing required rocketchat session chat token!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(CHAT_ROOM_ID)) {
      const MESSAGE = `Missing required rocketchat session chat room id!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(ROOM_SUBSCRIBE_ID)) {
      const MESSAGE = `Missing required rocketchat session room subscribe id!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(STREAM_LIVECHAT_SUBSCRIBE_ID)) {
      const MESSAGE = `Missing required rocketchat session room subscribe id stream livechat subscribe id!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }


    const CONNECT_PARAMS = {
      msg: 'connect',
      version: '1',
      support: ['1', 'pre2', 'pre1']
    };

    const LOGIN_BY_TOKEN = {
      msg: 'method',
      method: 'livechat:loginByToken',
      params: [CHAT_TOKEN],
      id: String(messagesCount++),
    };

    const REGISTER_USER = {
      msg: 'method',
      method: 'livechat:registerGuest',
      params: [{
        token: CHAT_TOKEN,
        name: USER_PROFILE_FULL_NAME,
        email: USER_PROFILE_EMAIL, 'department': null
      }],
      id: String(messagesCount++),
    };

    const FIRST_MESSAGE = {
      msg: 'method',
      method: 'sendMessageLivechat',
      params: [{
        _id: uuid(),
        rid: CHAT_ROOM_ID,
        msg: ' ',
        token: CHAT_TOKEN,
      }, null],
      id: String(messagesCount++),
    };

    const ROOM_MESSAGES_SUBSCRIBE = {
      msg: 'sub',
      id: ROOM_SUBSCRIBE_ID,
      name: 'stream-room-messages',
      params: [
        CHAT_ROOM_ID,
        {
          useCollection: false,
          args: [{ visitorToken: CHAT_TOKEN }]
        }
      ]
    };

    const STREAM_LIVECHAT_ROOM_SUBSCRIBE = {
      msg: 'sub',
      id: STREAM_LIVECHAT_SUBSCRIBE_ID,
      name: 'stream-livechat-room',
      params: [
        CHAT_ROOM_ID,
        {
          useCollection: false,
          args: [{ 'visitorToken': CHAT_TOKEN }]
        }]
    };

    await channel.rocketchatSocket.send(JSON.stringify(CONNECT_PARAMS));
    await channel.rocketchatSocket.send(JSON.stringify(LOGIN_BY_TOKEN));
    await channel.rocketchatSocket.send(JSON.stringify(REGISTER_USER));
    await channel.rocketchatSocket.send(JSON.stringify(FIRST_MESSAGE));
    await channel.rocketchatSocket.send(JSON.stringify(ROOM_MESSAGES_SUBSCRIBE));
    await channel.rocketchatSocket.send(JSON.stringify(STREAM_LIVECHAT_ROOM_SUBSCRIBE));

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(connectUserToChat.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
export {
  connectUserToChat,
}
