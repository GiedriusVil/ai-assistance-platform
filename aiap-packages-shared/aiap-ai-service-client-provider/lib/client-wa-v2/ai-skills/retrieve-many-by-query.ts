/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v2-ai-skills-retrieve-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ACA_CODEC_ENCODE_TYPES,
  encode,
} from '@ibm-aca/aca-utils-codec';

import {
  IContextV1,
  IAiServiceExternalV1WaV2,
  AI_SERVICE_TYPE_ENUM,
} from '@ibm-aiap/aiap--types-server';

import {
  execHttpGetRequest,
} from '@ibm-aca/aca-wrapper-http';

import {
  IRetrieveAiSkillsByQueryParamsV1,
  IRetrieveAiSkillsByQueryResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV2,
} from '..';

import {
  wrapIntoAiSkillsV1,
} from '../../wrappers';

export const retrieveManyByQuery = async (
  client: AiServiceClientV1WaV2,
  context: IContextV1,
  params: IRetrieveAiSkillsByQueryParamsV1,
): Promise<IRetrieveAiSkillsByQueryResponseV1> => {

  let aiServiceExternal: IAiServiceExternalV1WaV2;

  let request;
  let response;

  try {
    aiServiceExternal = client?.aiService?.external as IAiServiceExternalV1WaV2;
    if (
      lodash.isEmpty(aiServiceExternal?.assistantId)
    ) {
      const ERROR_MESSAGE = `Missing required client?.aiService?.external?.assistantId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(aiServiceExternal?.url)
    ) {
      const ERROR_MESSAGE = `Missing required params?.aiService?.external?.url parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(aiServiceExternal?.version)
    ) {
      const ERROR_MESSAGE = `Missing required params?.aiService?.external?.version parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const CREDENTIALs = encode({
      type: ACA_CODEC_ENCODE_TYPES.STRING_2_BASE64,
      input: `apikey:${aiServiceExternal?.apiKey}`,
    });

    request = {
      url: `${aiServiceExternal?.url}/v2/assistants/${aiServiceExternal?.assistantId}/skills_export`,
      headers: {
        Authorization: `Basic ${CREDENTIALs}`,
      },
      queryParams: {
        version: aiServiceExternal?.version,
      }
    };
    response = await execHttpGetRequest(context, request);

    const ITEMS = wrapIntoAiSkillsV1(AI_SERVICE_TYPE_ENUM.WA_V2, response?.body?.assistant_skills);
    const RET_VAL: IRetrieveAiSkillsByQueryResponseV1 = {
      items: ITEMS,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
