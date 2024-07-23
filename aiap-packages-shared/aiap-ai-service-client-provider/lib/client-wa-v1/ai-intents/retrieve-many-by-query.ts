/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-intents-retrieve-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiSkillExternalV1WaV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IRetrieveAiIntentsByQueryParamsV1,
  IRetrieveAiIntentsByQueryResponseV1,
} from '../../types';

import {
  wrapIntoAiIntentV1,
} from '../../wrappers';

import {
  AiServiceClientV1WaV1,
} from '..'

export const retrieveManyByQuery = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IRetrieveAiIntentsByQueryParamsV1,
): Promise<IRetrieveAiIntentsByQueryResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let external: IAiSkillExternalV1WaV1;
  let response;
  try {
    external = params?.query?.filter?.aiSkill?.external as IAiSkillExternalV1WaV1;
    if (
      lodash.isEmpty(external?.workspace_id)
    ) {
      const MESSAGE = `Missing required params?.skill?.external?.workspace_id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const REQUEST = {
      workspaceId: external?.workspace_id,
      pageLimit: 9999,
    };
    response = await client.assistant.listIntents(REQUEST);
    const ITEMS = wrapIntoAiIntentV1(AI_SERVICE_TYPE_ENUM.WA_V1, response?.result?.intents);
    const RET_VAL: IRetrieveAiIntentsByQueryResponseV1 = {
      items: ITEMS,
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(retrieveManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR
  }
}
