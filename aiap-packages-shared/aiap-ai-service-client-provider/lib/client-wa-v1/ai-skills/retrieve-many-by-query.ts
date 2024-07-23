/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-skills-retrieve-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AssistantV1,
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import {
  AI_SERVICE_TYPE_ENUM,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';
import {
  IRetrieveAiSkillsByQueryParamsV1,
  IRetrieveAiSkillsByQueryResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';
import { wrapIntoAiSkillsV1 } from '../../wrappers';

export const retrieveManyByQuery = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IRetrieveAiSkillsByQueryParamsV1,
): Promise<IRetrieveAiSkillsByQueryResponseV1> => {
  try {
    const PARAMS: AssistantV1.ListWorkspacesParams = {
      pageLimit: 1000
    };

    const RESPONSE = await client.assistant.listWorkspaces(PARAMS);

    const ITEMS = wrapIntoAiSkillsV1(AI_SERVICE_TYPE_ENUM.WA_V1, RESPONSE?.result?.workspaces);

    const RET_VAL = {
      items: ITEMS,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
