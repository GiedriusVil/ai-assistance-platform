/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-channel-rocketchat-provider-construct-rocketchat-session';

const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import uuid from 'uuid/v4';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

const constructRocketchatSession = () => {
  let retVal;
  try {
    const CHAT_ROOM_ID = uuid();
    const CHAT_TOKEN = uuid();
    const ROOM_SUBSCRIBE_ID = uuid();
    const STREAM_LIVECHAT_SUBSCRIBE_ID = uuid();

    retVal = {
      chatToken: CHAT_TOKEN,
      chatRoomId: CHAT_ROOM_ID,
      roomSubscribeId: ROOM_SUBSCRIBE_ID,
      streamLivechatSubscribeId: STREAM_LIVECHAT_SUBSCRIBE_ID
    }
    return retVal;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructRocketchatSession.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  constructRocketchatSession
}
