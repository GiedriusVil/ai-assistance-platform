/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-skills-check-one-for-status-available';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  appendDataToError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ICheckAiSkillByIdForStatusAvailableParamsV1,
  ICheckAiSkillByIdForStatusAvailableResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV2,
} from '..';


export const checkOneByIdForStatusAvailable = async (
  client: AiServiceClientV1WaV2,
  context: IContextV1,
  params: ICheckAiSkillByIdForStatusAvailableParamsV1,
): Promise<ICheckAiSkillByIdForStatusAvailableResponseV1> => {
  let userId;
  let workspaceId;

  let retVal: ICheckAiSkillByIdForStatusAvailableResponseV1;
  try {
    userId = context?.user?.id;


    retVal = {
      value: false,
    };

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { userId, workspaceId });
    logger.error(checkOneByIdForStatusAvailable.name, ACA_ERROR);
    throw ACA_ERROR;
  }
}
