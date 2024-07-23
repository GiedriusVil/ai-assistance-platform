/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-skills-retrieve-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  AssistantV1,
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import {
  IRetrieveAiSkillByIdParamsV1,
  IRetrieveAiSkillByIdResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

export const retrieveOneById = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IRetrieveAiSkillByIdParamsV1,
): Promise<IRetrieveAiSkillByIdResponseV1> => {
  let userId;
  let workspaceId;

  let retVal;
  try {
    userId = context?.user?.id;
    workspaceId = params?.id;

    if (
      lodash.isEmpty(workspaceId)
    ) {
      const ERROR_MESSAGE = `Missing required params?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const PARAMS: AssistantV1.GetWorkspaceParams = {
      workspaceId: workspaceId,
      _export: true,
      sort: 'stable'
    };

    const RESPONSE = await client.assistant.getWorkspace(PARAMS);
    retVal = {
      skill: RESPONSE?.result,
    };
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR,
      {
        userId,
        workspaceId,
      });
    logger.error(retrieveOneById.name, ACA_ERROR);
    throw ACA_ERROR;
  }
}
