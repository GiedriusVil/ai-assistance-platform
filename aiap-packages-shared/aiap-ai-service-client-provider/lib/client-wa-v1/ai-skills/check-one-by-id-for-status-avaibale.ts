/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-skills-check-one-for-status-available';
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
  ICheckAiSkillByIdForStatusAvailableParamsV1,
  ICheckAiSkillByIdForStatusAvailableResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

export const checkOneByIdForStatusAvailable = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: ICheckAiSkillByIdForStatusAvailableParamsV1,
): Promise<ICheckAiSkillByIdForStatusAvailableResponseV1> => {
  let userId;
  let workspaceId;

  let retVal: ICheckAiSkillByIdForStatusAvailableResponseV1;
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
    };

    retVal = {
      value: false,
    };

    const RESPONSE = await client.assistant.getWorkspace(PARAMS);
    if (
      RESPONSE?.result?.status !== 'Available'
    ) {
      retVal = {
        value: true,
      };
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { userId, workspaceId });
    logger.error(checkOneByIdForStatusAvailable.name, ACA_ERROR);
    throw ACA_ERROR;
  }
}
