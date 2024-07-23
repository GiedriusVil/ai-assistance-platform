/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-skills-sync-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiSkillV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISynchroniseAiSkillParamsV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

export const syncOne = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: ISynchroniseAiSkillParamsV1,
): Promise<IAiSkillV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let retVal: IAiSkillV1;

  try {
    if (
      lodash.isEmpty(params?.aiSkill)
    ) {
      const ERROR_MESSAGE = `Missing required params?.aiSkill parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    
    retVal = params?.aiSkill;
    const PROMISES: Array<Promise<any>> = [];

    if (
      params?.options?.syncDialogNodes
    ) {
      PROMISES.push(
        client.dialogNodes.synchroniseWithinAiSkill(context, { aiSkill: retVal })
      );

    }

    if (
      params?.options?.syncEntities
    ) {
      PROMISES.push(
        client.entities.synchroniseWithinAiSkill(context, { aiSkill: retVal })
      );
    }
    
    if (
      params?.options?.syncIntents
    ) {
      PROMISES.push(
        client.intents.synchroniseWithinAiSkill(context, { aiSkill: retVal })
      );
    }

    await Promise.all(PROMISES)

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(syncOne.name, ACA_ERROR);
    throw ACA_ERROR;
  }
}
