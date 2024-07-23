/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-aws-lex-v2-request-send-one-for-confidence-check';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceResponseV1,
  IAiServiceResponseExternalV1AwsLexV2,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getAiServiceClientByAiService,
} from '@ibm-aiap/aiap-ai-service-client-provider';

import {
  ISendRequestForConfidenceCheckParamsV1,
} from '../../../types';

export const sendOneForConfidenceCheck = async (
  context: ISoeContextV1,
  params: ISendRequestForConfidenceCheckParamsV1,
): Promise<IAiServiceResponseV1> => {

  let aiService;
  let aiServiceRequest;
  let aiServiceClient;

  let response;
  let responseExternal: IAiServiceResponseExternalV1AwsLexV2;

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
    aiServiceClient = await getAiServiceClientByAiService(
      {
        user: {
          id: 'SYSTEM_SOE',
        }
      },
      { aiService }
    );

    response = await aiServiceClient.client.sendMessageForConfidenceCheck(context, { request: aiServiceRequest?.external });
    responseExternal = {
      ...response,
    }

    retVal = {
      type: aiService?.type,
      version: aiService?.version,
      external: responseExternal,
    };

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(sendOneForConfidenceCheck.name, { ACA_ERROR, aiService });
    throw ACA_ERROR;
  }
}
