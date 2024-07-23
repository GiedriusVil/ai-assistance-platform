/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-outgoing-message-message-identify-outgoing-message-type';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  OUTGOING_MESSAGE_TYPE
} from './outgoing-message-types';

const identifyOutgoingMessageType = (context, params) => {

  const MESSAGE = params?.message;
  const MESSAGE_ATTACHMENT_TYPE = MESSAGE?.message?.attachment?.type;

  try {
    if (
      !lodash.isEmpty(MESSAGE_ATTACHMENT_TYPE) &&
      MESSAGE_ATTACHMENT_TYPE === OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_DEBUG
    ) {
      return OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_DEBUG;
    }
    if (
      !lodash.isEmpty(MESSAGE_ATTACHMENT_TYPE) &&
      MESSAGE_ATTACHMENT_TYPE === OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_ERROR
    ) {
      return OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_ERROR;
    }
    if (
      !lodash.isEmpty(MESSAGE_ATTACHMENT_TYPE)
    ) {
      return OUTGOING_MESSAGE_TYPE.DEFAULT
    }

    return OUTGOING_MESSAGE_TYPE.DEFAULT;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { MESSAGE });
    logger.error(identifyOutgoingMessageType.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  identifyOutgoingMessageType,
}
