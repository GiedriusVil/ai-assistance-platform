/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-client-transformer-transform-genesys-messages';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';


const transformGenesysMessage = (
  messageAsArray: any
) => {
  try {
    let retVal = undefined;
    if (
      !lodash.isEmpty(messageAsArray) &&
      lodash.isArray(messageAsArray)
    ) {
      retVal = {};
      if (
        messageAsArray.length > 0
      ) {
        retVal.type = messageAsArray[0];
      }
      if (
        messageAsArray.length > 1
      ) {
        retVal.name = messageAsArray[1];
      }
      if (
        messageAsArray.length > 2
      ) {
        retVal.message = messageAsArray[2];
      }
      if (
        messageAsArray.length > 3
      ) {
        retVal.sequence = messageAsArray[3];
      }
      if (
        messageAsArray.length > 4
      ) {
        retVal.sender = messageAsArray[4];
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(transformGenesysMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


const transformGenesysMessages = (
  messages
) => {
  try {
    const RET_VAL = [];
    if (
      !lodash.isEmpty(messages) &&
      lodash.isArray(messages)
    ) {
      for (const MESSAGE of messages) {
        const AIAP_MESSAGE = transformGenesysMessage(MESSAGE);
        if (
          !lodash.isEmpty(AIAP_MESSAGE)
        ) {
          RET_VAL.push(AIAP_MESSAGE);
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(transformGenesysMessages.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  transformGenesysMessages,
}
