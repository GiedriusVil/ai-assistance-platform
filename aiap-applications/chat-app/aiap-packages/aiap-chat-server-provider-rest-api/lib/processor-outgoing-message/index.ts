
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-rest-server-provider-processor-outgoing-message-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  OUTGOING_MESSAGE_TYPE
} from './outgoing-message-types';

import {
  identifyOutgoingMessageType
} from './identify-outgoing-message-type';

import {
  processDefaultByAttachmentAcaDebug
} from './process-default-by-attachment-aca-debug';

import {
  processDefaultByAttachmentAcaError
} from './process-default-by-attachment-aca-error';

import {
  processDefault
} from './process-default';


const processOutgoingMessage = async (context, params) => {
  let outgoingMessageType;

  try {
    outgoingMessageType = identifyOutgoingMessageType(context, params);
    switch (outgoingMessageType) {
      case OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_DEBUG:
        await processDefaultByAttachmentAcaDebug(context, params);
        break;
      case OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_ERROR:
        await processDefaultByAttachmentAcaError(context, params);
        break;
      default:
        await processDefault(context, params);
        break;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processOutgoingMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processOutgoingMessage,
}
