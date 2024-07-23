
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-incoming-message-process-hang-up';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  destroyChatRestSessionProvider
} from '../session-provider-registry';

import {
  ChatRestV1SessionProvider
} from '../server-session-provider';

const processHangUp = async (
  chatRestSessionProvider: ChatRestV1SessionProvider,
  params: any
) => {
  const USER_ID = chatRestSessionProvider?.userId;
  const RESPONSE = params?.response;
  try {
    chatRestSessionProvider.clearRetrieveMessageInterval();
    await destroyChatRestSessionProvider({
      userId: USER_ID
    });
    RESPONSE.end();
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processHangUp.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processHangUp,
}
