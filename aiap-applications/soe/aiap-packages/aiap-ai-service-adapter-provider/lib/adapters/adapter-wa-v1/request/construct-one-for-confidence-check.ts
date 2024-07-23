/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-watson-assistant-v1-request-construct-one-for-confidence-check';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceV1,
  IAiServiceRequestV1,
  IAiServiceRequestExternalV1WaV1,
  IAiSkillExternalV1WaV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IConstructRequestForConfidenceCheckParamsV1,
} from '../../../types';

export const constructOneForConfidenceCheck = async (
  context: ISoeContextV1,
  params: IConstructRequestForConfidenceCheckParamsV1
): Promise<IAiServiceRequestV1> => {
  let external: IAiServiceRequestExternalV1WaV1;

  let aiService: IAiServiceV1;
  let aiServiceAiSkillExternal: IAiSkillExternalV1WaV1;

  let retVal: IAiServiceRequestV1;
  try {
    aiService = params?.aiService;
    aiServiceAiSkillExternal = params?.aiService?.aiSkill?.external as IAiSkillExternalV1WaV1;

    external = {
      workspaceId: aiServiceAiSkillExternal?.workspace_id,
      input: {
        text: params?.text,
      },
      alternateIntents: true,
      headers: {
        'X-Watson-Metadata': {
          customer_id:
            params?.update?.sender?.id || 'CLASSIFIER'
        },
      },
      context: {
        metadata: {
          user_id:
            params?.update?.sender?.id || 'CLASSIFIER',
        },
      }
    }

    retVal = {
      type: aiService?.type,
      version: aiService?.version,
      external: external,
    };

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOneForConfidenceCheck.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
