/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-ai-service-logs-retrieve-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  appendDataToError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
  IAiServiceExternalV1WaV2,
  AI_SERVICE_TYPE_ENUM,
} from '@ibm-aiap/aiap--types-server';

import {
  AssistantV2,
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import {
  IRetrieveAiServiceLogsByQueryParamsV1,
  IRetrieveAiServiceLogsByQueryResponseV1,
} from '../../types';

import {
  wrapIntoAiLogRecordV1,
} from '../../wrappers';

import {
  AiServiceClientV1WaV2,
} from '..';

export const retrieveManyByQuery = async (
  client: AiServiceClientV1WaV2,
  context: IContextV1,
  params: IRetrieveAiServiceLogsByQueryParamsV1,
): Promise<IRetrieveAiServiceLogsByQueryResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let aiServiceExternal: IAiServiceExternalV1WaV2;
  try {
    aiServiceExternal = client?.aiService?.external as IAiServiceExternalV1WaV2;
    const LIST_LOGS_PARAMS: AssistantV2.ListLogsParams = {
      assistantId: aiServiceExternal?.assistantId,
      pageLimit: 9999,
    };

    const RESPONSE = await client.assistant.listLogs(LIST_LOGS_PARAMS);
    const ITEMS = wrapIntoAiLogRecordV1(AI_SERVICE_TYPE_ENUM.WA_V2, RESPONSE?.result?.logs);

    const RET_VAL = {
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
