
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-incoming-message-process-default';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  setRetrieveMessageInterval
} from '../utils';

import {
  ChatRestV1SessionProvider
} from '../server-session-provider';

const processDefault = async (
  chatRestSessionProvider: ChatRestV1SessionProvider,
  params: any
) => {
  const REQUEST_BODY = params?.body;
  const MESSAGE = REQUEST_BODY?.input;
  try {
    await chatRestSessionProvider.handleIncomingMessageEvent(MESSAGE);
    if (!chatRestSessionProvider?.retrieveMessageInterval) {
      const RETRIEVE_MESSAGE_INTERVAL = await setRetrieveMessageInterval(chatRestSessionProvider, params);
      chatRestSessionProvider.setRetrieveMessageInterval(RETRIEVE_MESSAGE_INTERVAL);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { MESSAGE });
    logger.error(processDefault.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processDefault,
}
