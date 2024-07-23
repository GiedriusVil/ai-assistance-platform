/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-chat-rest-server-provider-session-provider-registry-destroy-session-provider`;
const logger = require(`@ibm-aca/aca-common-logger`)(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  getRegistry
} from './registry';

const destroyChatRestSessionProvider = async (params) => {
  const USER_ID = params?.userId;

  let registryChatRestSessionProvider;
  let chatRestSesionProvider;

  try {
    if (
      lodash.isEmpty(USER_ID)
    ) {
      const MESSAGE = `Missing required params.userId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    registryChatRestSessionProvider = getRegistry();

    if (
      registryChatRestSessionProvider
    ) {
      chatRestSesionProvider = registryChatRestSessionProvider[USER_ID];
      if (
        chatRestSesionProvider
      ) {
        await chatRestSesionProvider.disconnect();
        delete registryChatRestSessionProvider[USER_ID];
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID });
    logger.error(destroyChatRestSessionProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  destroyChatRestSessionProvider,
}
