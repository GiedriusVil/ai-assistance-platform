/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-client-utils-get-request-url';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { ACA_ERROR_TYPE, formatIntoAcaError, throwAcaError } from '@ibm-aca/aca-utils-errors';

import {
  IChatChannelV1GenesysCohV2Configuration,
} from '../types';

const CLIENT_ACTIONS = {
  send: 'send',
  refresh: 'refresh',
  disconnect: 'disconnect',
  startTyping: 'startTyping',
  stopTyping: 'stopTyping',
};

const getRequestUrl = (
  params: {
    configuration: IChatChannelV1GenesysCohV2Configuration,
    action: string,
    conversationIdExternal: string,
  },
) => {
  try {
    if (
      lodash.isEmpty(params?.configuration?.external?.url)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.configuration?.external?.url parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.configuration?.external?.version)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.configuration?.external?.version parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.configuration?.external?.environment)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.configuration?.external?.environment parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.conversationIdExternal)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.conversationIdExternal parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.action)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.action parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const URL = params?.configuration?.external?.url;
    const VERSION = params?.configuration?.external?.version;
    const ENVIRONMENT = params?.configuration?.external?.environment;

    const CONVERSATION_ID_EXTERNAL = params?.conversationIdExternal;

    const ACTION = params?.action;

    const RET_VAL = `${URL}/${VERSION}/chat/${ENVIRONMENT}/${CONVERSATION_ID_EXTERNAL}/${CLIENT_ACTIONS[ACTION]}`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getRequestUrl.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  getRequestUrl,
}
