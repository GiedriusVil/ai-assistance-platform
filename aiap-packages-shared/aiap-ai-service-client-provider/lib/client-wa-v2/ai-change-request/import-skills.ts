/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-v2-ai-change-request-import-skills';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import { setTimeout } from 'timers/promises';
import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
  IAiServiceExternalV1WaV2
} from '@ibm-aiap/aiap--types-server';

import {
  AiServiceClientV1WaV2,
} from '..';


import {
  IImportSkillsParamsV1,
  IImportSkillsResponseV1
} from '../../types';


export const importSkills = async (
  client: AiServiceClientV1WaV2,
  context: IContextV1,
  params: IImportSkillsParamsV1,
): Promise<void> => {

  try {
    const ASSISTANT_EXTERNAL_ID = (client?.aiService?.external as IAiServiceExternalV1WaV2)?.assistantId;
    const ASSISTANT_SKILLS = params?.assistantSkills;
    const ASSISTANT_STATE = params?.assistantState;

    if (
      lodash.isEmpty(ASSISTANT_EXTERNAL_ID)
    ) {
      const ERROR_MESSAGE = `Missing required client.aiService.external.assistantId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    if (
      lodash.isEmpty(ASSISTANT_SKILLS)
    ) {
      const ERROR_MESSAGE = `Missing required params.assistantSkills parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    if (
      lodash.isEmpty(ASSISTANT_STATE)
    ) {
      const ERROR_MESSAGE = `Missing required params.assistantState parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }


    await client.assistant.importSkills({
      assistantId: ASSISTANT_EXTERNAL_ID,
      assistantSkills: ASSISTANT_SKILLS,
      assistantState: ASSISTANT_STATE
    });

    return;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(importSkills.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
