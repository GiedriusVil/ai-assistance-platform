
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v2-ai-skills-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISaveAiSkillParamsV1,
  ISaveAiSkillResponseV1,
} from '../../../types';

import {
  AiServiceClientV1WaV2,
} from '../..';

export const saveOne = async (
  client: AiServiceClientV1WaV2,
  context: IContextV1,
  params: ISaveAiSkillParamsV1,
): Promise<ISaveAiSkillResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let retVal: ISaveAiSkillResponseV1;
  try {

    retVal = {};
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
