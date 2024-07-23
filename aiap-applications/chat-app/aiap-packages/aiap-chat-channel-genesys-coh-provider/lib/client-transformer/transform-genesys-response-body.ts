/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-client-transformer-transform-genesys-response-body';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

const transfromGenesysMessageV2 = (
  messageAsArray: any,
) => {
  try {
    const RET_VAL: any = {};
    if (
      messageAsArray.from.type === 'Client'
    ) {
      return {};
    }
    if (
      messageAsArray.from.type === 'External'
    ) {
      RET_VAL.type = 'Notification';
    } else {
      RET_VAL.type = messageAsArray.type;
    }
    if (
      messageAsArray.text
    ) {
      RET_VAL.message = messageAsArray.text;
    }
    if (
      messageAsArray.from &&
      !lodash.isEmpty(messageAsArray.from.nickname)
    ) {
      RET_VAL.nickname = messageAsArray.from.nickname
    }
    RET_VAL.sequence = messageAsArray.index;
    RET_VAL.sender = messageAsArray.from.nickname;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(transfromGenesysMessageV2.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const transformGenesysMessagesV2 = (
  messages: any,
) => {
  try {
    const RET_VAL = [];
    if (
      !lodash.isEmpty(messages) &&
      lodash.isArray(messages)
    ) {
      messages.forEach(message => {
        const AIAP_MESSAGE = transfromGenesysMessageV2(message);
        if (
          !lodash.isEmpty(AIAP_MESSAGE)
        ) {
          RET_VAL.push(AIAP_MESSAGE);
        }
      })
    }
    return RET_VAL
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(transformGenesysMessagesV2.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const transformGenesysResponseBody = (
  data: any
) => {
  try {
    let retVal = {};
    let MESSAGES = [];
    const DATA = JSON.parse(data);
    MESSAGES = DATA?.messages;
    const POSITION = DATA?.nextPosition;
    retVal = {
      transcriptPosition: POSITION,
      messages: transformGenesysMessagesV2(MESSAGES),
      chat: {
        status: DATA.chatEnded == true ? 'DISCONNECTED' : 'CONNECTED'
      }
    };
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(transformGenesysResponseBody.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  transformGenesysResponseBody,
}
