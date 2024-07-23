/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-aws-lex-v2-request-send-one';
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
  ISendRequestParamsV1,
} from '../../../types';

export const sendOne = async (
  context: ISoeContextV1,
  params: ISendRequestParamsV1,
): Promise<IAiServiceResponseV1> => {

  let aiService;
  let aiServiceRequest;
  let aiServiceClient;

  let response: any;
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
    const TMP_CONTEXT = {
      user: {
        id: 'SYSTEM_SOE'
      }
    };
    aiServiceClient = await getAiServiceClientByAiService(
      TMP_CONTEXT,
      {
        aiService,
      }
    );
    response = await aiServiceClient.client.sendMessage(
      TMP_CONTEXT,
      {
        request: aiServiceRequest?.external,
      });

    responseExternal = {
      ...response,
    }

    if (
      responseExternal['$metadata']
    ) {
      responseExternal.metadata = lodash.cloneDeep(responseExternal['$metadata']);
      delete responseExternal['$metadata'];
    }

    retVal = {
      type: aiService?.type,
      version: aiService?.version,
      external: responseExternal,
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(sendOne.name, { ACA_ERROR, aiService });
    throw ACA_ERROR;
  }
}
