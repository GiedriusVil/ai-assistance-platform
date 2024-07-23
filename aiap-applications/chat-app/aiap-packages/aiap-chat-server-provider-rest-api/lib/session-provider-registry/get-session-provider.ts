/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-chat-rest-server-provider-session-provider-registry-get-session-provider`;
const logger = require(`@ibm-aca/aca-common-logger`)(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  isSessionValid,
  deleteSession
} from '@ibm-aca/aca-utils-session';

import {
  getRegistry
} from './registry';

import {
  ChatRestV1SessionProvider
} from '../server-session-provider';

const getChatRestSessionProvider = async (params) => {
  const USER_ID = params?.userId;

  let providerRegistry;
  let provider;

  try {
    if (
      lodash.isEmpty(USER_ID)
    ) {
      const MESSAGE = `Missing required params.userId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    providerRegistry = getRegistry();
    provider = providerRegistry[USER_ID];

    if (
      lodash.isEmpty(provider)
    ) {
      provider = await ChatRestV1SessionProvider.getInstance(params);
      providerRegistry[USER_ID] = provider;
    } else {
      const IS_SESSION_VALID = await isSessionValid(provider?.session);
      if (
        !IS_SESSION_VALID
      ) {
        await deleteSession(provider?.session);
        const MESSAGE = `Session Expired. Please authorize!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, MESSAGE);
      }
    }
    logger.debug(`${MODULE_ID} --> ${getChatRestSessionProvider.name}`, { providerRegistry });
    const RET_VAL = provider;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getChatRestSessionProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  getChatRestSessionProvider,
}
