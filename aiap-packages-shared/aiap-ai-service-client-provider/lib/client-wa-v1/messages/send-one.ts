/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-messages-send-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  AssistantV1,
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  retryAsync,
} from '@ibm-aiap/aiap-wrapper-async-retry';

import {
  asyncRetryOptions,
} from '../async-retry-options';

import {
  ISendMessageParamsV1,
  ISendMessageResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

const _sendOne = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: ISendMessageParamsV1,
): Promise<ISendMessageResponseV1> => {
  let request: AssistantV1.MessageParams;
  let retVal;
  try {
    request = params?.request;
    if (
      lodash.isEmpty(request)
    ) {
      // Don't retry on this error
      const ERROR_MESSAGE = `Missing required params.request parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    retVal = await client.assistant.message(request);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_sendOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export const sendOne = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: ISendMessageParamsV1,
): Promise<ISendMessageResponseV1> => {
  const ASYNC_RETRY_OPTIONS = asyncRetryOptions(client, context);
  const RET_VAL: ISendMessageResponseV1 = await retryAsync(
    async (
      bail,
      attempt,
    ) => {
      try {
        const RET_VAL = await _sendOne(client, context, params);
        return RET_VAL;
      } catch (error) {
        if (
          error?.type === ACA_ERROR_TYPE.VALIDATION_ERROR
        ) {
          bail(error);
          return;
        }
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { attempt });
        logger.error(sendOne.name, { ACA_ERROR });
        throw ACA_ERROR;
      }
    },
    ASYNC_RETRY_OPTIONS
  );
  return RET_VAL;
}
