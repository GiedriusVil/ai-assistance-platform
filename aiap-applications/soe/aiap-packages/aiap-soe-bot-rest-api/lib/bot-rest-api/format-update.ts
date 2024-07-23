/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-bot-rest-api-bot-rest-api-format-update';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  CONSTANTS,
} from './constants';

const formatUpdate = (
  conversationId,
  recipientId,
  request: {
    headers: any,
    body: {
      message: {
        text: any,
      },
      source: any,
      client: {
        metadata: any,
        profile: any,
      }
    },
  },
  pingpong = false,
) => {

  try {
    const HEADERS = request.headers;
    const BODY = request.body;

    const RET_VAL: any = {
      channel: HEADERS['x-aca-channel'] || CONSTANTS.DEFAULT_CHANNEL,
      sender: {
        id: pingpong ? CONSTANTS.PING_PONG_PREFIX + conversationId : conversationId,
      },
      recipient: {
        id: recipientId,
      },
      message: {
        text: BODY.message.text,
        incoming_timestamp: new Date().getTime(),
      },
      source: BODY.source ? BODY.source.toUpperCase() : null,
    };

    const CLIENT_DATA_PROFILE = BODY?.client?.profile;
    if (
      CLIENT_DATA_PROFILE != null
    ) {
      RET_VAL.private = ramda.assoc(['profile'], CLIENT_DATA_PROFILE, RET_VAL.private);
    }

    const CLIENT_DATA_METADATA = BODY?.client?.metadata;
    if (
      CLIENT_DATA_METADATA != null
    ) {
      RET_VAL.metadata = ramda.assoc(['metadata'], CLIENT_DATA_METADATA, RET_VAL.metadata);
    }

    return RET_VAL;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(formatUpdate.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  formatUpdate,
}
