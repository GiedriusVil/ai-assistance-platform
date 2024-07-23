
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-rest-server-provider-processor-incoming-message-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  INCOMING_MESSAGE_TYPE
} from './incoming-message-types';

import {
  processHangUp
} from './process-hang-up';

import {
  processDefault
} from './process-default';

import {
  processPostResponseTimeout
} from './process-post-timeout';

import {
  ChatRestV1SessionProvider
} from '../server-session-provider';


const processIncomingMessage = async (
  chatRestSessionProvider: ChatRestV1SessionProvider,
  params: any
) => {
  const REQUEST_BODY = params?.body;
  const MESSAGE = REQUEST_BODY?.input;
  const MESSAGE_TYPE = MESSAGE?.text;
  try {
    switch (MESSAGE_TYPE) {
      case INCOMING_MESSAGE_TYPE.VWG_HANGUP:
        await processHangUp(chatRestSessionProvider,params);
        break;
      case INCOMING_MESSAGE_TYPE.VWG_POST_RESPONSE_TIMEOUT:
        await processPostResponseTimeout(chatRestSessionProvider,params);
        break;
      default:
        await processDefault(chatRestSessionProvider,params);
        break;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processIncomingMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processIncomingMessage,
}
