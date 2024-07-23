/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-chatgpt-v3-request-send-one-for-confidence-check';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceV1,
  IAiServiceRequestV1,
  IAiServiceResponseV1,
  IAiServiceResponseExternalV1ChatGptV3,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IAiServiceClientV1,
  getAiServiceClientByAiService,
} from '@ibm-aiap/aiap-ai-service-client-provider';

import {
  ISendRequestForConfidenceCheckParamsV1,
} from '../../../types';

export const sendOneForConfidenceCheck = async (
  context: ISoeContextV1,
  params: ISendRequestForConfidenceCheckParamsV1,
): Promise<IAiServiceResponseV1> => {

  let aiService: IAiServiceV1;
  let aiServiceRequest: IAiServiceRequestV1;
  let aiServiceClient: IAiServiceClientV1;

  let response;

  let external: IAiServiceResponseExternalV1ChatGptV3;

  let retVal: IAiServiceResponseV1;
  try {
    aiService = params?.aiService;
    aiServiceRequest = params?.aiServiceRequest;
    if (
      lodash.isEmpty(aiService)
    ) {
      const ERROR_MESSAGE = `Missing required params.aiService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(aiServiceRequest)
    ) {
      const ERROR_MESSAGE = `Missing required params.aiServiceRequest parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(aiServiceRequest?.external)
    ) {
      const ERROR_MESSAGE = `Missing required params.aiServiceRequest.external parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const USER = {
      id: 'SYSTEM_SOE',
    }

    aiServiceClient = await getAiServiceClientByAiService(
      {
        user: USER,
      },
      {
        aiService,
      });

    response = await aiServiceClient.messages.sendOne(
      {
        user: USER,
      },
      {
        request: aiServiceRequest?.external,
      }
    )

    external = {
      headers: response?.headers,
      data: response?.data,
    }

    retVal = {
      type: aiService?.type,
      version: aiService?.version,
      external: external,
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(sendOneForConfidenceCheck.name, { ACA_ERROR, aiService });
    throw ACA_ERROR;
  }
}
