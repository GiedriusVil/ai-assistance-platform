/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-channel-rocketchat-provider-process-ping-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IChatChannelV1RocketchatProcessMessageParams
} from '../types';

const processPingMessage = async (
  params: IChatChannelV1RocketchatProcessMessageParams
) => {
  try {
    const CHANNEL = params?.channel;
    const PING_RESPONSE = {
      msg: 'pong'
    };
    await CHANNEL.rocketchatSocket.send(JSON.stringify(PING_RESPONSE));
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processPingMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processPingMessage
}
