/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AI_SERVICE_TYPE_ENUM,
  IContextV1,
  IAiServiceV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IAiServiceClientV1,
} from './lib/client';

import {
  AiServiceClientV1AwsLexV2,
} from './lib/client-aws-lex-v2';

import {
  AiServiceClientV1ChatGptV3,
} from './lib/client-chat-gpt-v3';

import {
  AiServiceClientV1WaV1,
} from './lib/client-wa-v1';

import {
  AiServiceClientV1WaV2,
} from './lib/client-wa-v2';

const REGISTRY: {
  [key: string]: IAiServiceClientV1,
} = {}

const ensureAiServiceClientExistance = async (
  context: IContextV1,
  params: {
    aiService: IAiServiceV1,
  },
) => {
  let client: IAiServiceClientV1;
  try {
    if (
      lodash.isEmpty(params?.aiService?.id)
    ) {
      const ERROR_MESSAGE = `Missing required params?.aiService?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.aiService?.type)
    ) {
      const ERROR_MESSAGE = `Missing required params?.aiService?.type parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    client = REGISTRY[params?.aiService?.id];
    if (
      lodash.isEmpty(client)
    ) {
      switch (params?.aiService?.type) {
        case AI_SERVICE_TYPE_ENUM.AWS_LEX_V2:
          client = new AiServiceClientV1AwsLexV2(params?.aiService);
          break;
        case AI_SERVICE_TYPE_ENUM.CHAT_GPT_V3:
          client = new AiServiceClientV1ChatGptV3(params?.aiService);
          break;
        case AI_SERVICE_TYPE_ENUM.WA_V1:
          client = new AiServiceClientV1WaV1(params?.aiService);
          break;
        case AI_SERVICE_TYPE_ENUM.WA_V2:
          client = new AiServiceClientV1WaV2(params?.aiService);
          break;
        default:
          break
      }
      if (
        lodash.isEmpty(client)
      ) {
        const ERROR_MESSAGE = `Unsupported provided params?.aiService?.type! [Actual: ${params?.aiService?.type}]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      await client.initialise();
      REGISTRY[params?.aiService?.id] = client;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureAiServiceClientExistance.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAiServiceClientByAiService = async (
  context: IContextV1,
  params: {
    aiService: IAiServiceV1,
  },
): Promise<IAiServiceClientV1> => {

  let retVal: IAiServiceClientV1;
  try {
    await ensureAiServiceClientExistance(context, params);
    retVal = REGISTRY[params?.aiService?.id];
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAiServiceClientByAiService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export * from './lib/client';
export * from './lib/types';

export {
  IAiServiceClientV1,
  getAiServiceClientByAiService,
}
