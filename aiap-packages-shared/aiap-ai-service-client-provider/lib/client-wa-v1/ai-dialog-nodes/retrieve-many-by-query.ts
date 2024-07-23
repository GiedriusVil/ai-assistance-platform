/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-ai-service-client-provider-client-wa-v1-ai-dialog-nodes-retrieve-many-by-query`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  AI_SERVICE_TYPE_ENUM,
  IAiSkillExternalV1WaV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  AssistantV1,
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import {
  IRetrieveAiDialogNodesByQueryParamsV1,
  IRetrieveAiDialogNodesByQueryResponseV1,
} from '../../types';

import {
  wrapIntoIAiDialogNodeV1,
} from '../../wrappers';

import {
  AiServiceClientV1WaV1,
} from '..';

export const retrieveManyByQuery = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IRetrieveAiDialogNodesByQueryParamsV1,
): Promise<IRetrieveAiDialogNodesByQueryResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let external: IAiSkillExternalV1WaV1;
  let response: AssistantV1.Response<AssistantV1.DialogNodeCollection>;
  try {

    external = params?.query?.filter?.aiSkill?.external as IAiSkillExternalV1WaV1;

    const REQUEST: AssistantV1.ListDialogNodesParams = {
      workspaceId: external?.workspace_id,
      pageLimit: params?.query?.pagination.size || 9999,
    };

    response = await client.assistant.listDialogNodes(REQUEST);

    const ITEMS = wrapIntoIAiDialogNodeV1(AI_SERVICE_TYPE_ENUM.WA_V1, response?.result.dialog_nodes);

    const RET_VAL: IRetrieveAiDialogNodesByQueryResponseV1 = {
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
