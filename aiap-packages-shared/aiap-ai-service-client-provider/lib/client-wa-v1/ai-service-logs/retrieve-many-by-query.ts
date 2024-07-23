/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-service-logs-retrieve-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiSkillExternalV1WaV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IRetrieveAiServiceLogsByQueryParamsV1,
  IRetrieveAiServiceLogsByQueryResponseV1,
} from '../../types';

import {
  wrapIntoAiLogRecordV1,
} from '../../wrappers';

import {
  AiServiceClientV1WaV1,
} from '..';

export const retrieveManyByQuery = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IRetrieveAiServiceLogsByQueryParamsV1,
): Promise<IRetrieveAiServiceLogsByQueryResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let external: IAiSkillExternalV1WaV1;

  try {
    external = params?.query?.filter?.aiSkill?.external as IAiSkillExternalV1WaV1;
    if (
      lodash.isEmpty(external?.workspace_id)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.akill?.external?.workspace_id parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const LIST_INTENTS_PARAMS = {
      workspaceId: external?.workspace_id,
      pageLimit: 9999,
    };
    const RESPONSE = await client.assistant.listLogs(LIST_INTENTS_PARAMS);

    const ITEMS = wrapIntoAiLogRecordV1(AI_SERVICE_TYPE_ENUM.WA_V1, RESPONSE?.result?.logs);

    const RET_VAL: IRetrieveAiServiceLogsByQueryResponseV1 = {
      items: ITEMS,
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(retrieveManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
