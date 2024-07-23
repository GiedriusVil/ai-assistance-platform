/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-skills-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiSkillExternalV1WaV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISaveAiSkillParamsV1,
  ISaveAiSkillResponseV1,
} from '../../../types';

import {
  AiServiceClientV1WaV1,
} from '../..';

import {
  sanitizeOneForCreate,
} from './sanitize-one-for-create';

import {
  sanitizeOneForUpdate,
} from './sanitize-one-for-update';

const _updateOne = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: ISaveAiSkillParamsV1,
): Promise<ISaveAiSkillResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  let retVal: ISaveAiSkillResponseV1;
  try {
    const SANITIZED_SKILL = sanitizeOneForUpdate(params);
    const RESPONSE = await client.assistant.updateWorkspace(SANITIZED_SKILL);
    retVal = {
      skill: RESPONSE?.result,
    }
    return retVal
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(_updateOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _createOne = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: ISaveAiSkillParamsV1,
) => {
  let userId;
  let workspaceId;
  let retVal: ISaveAiSkillResponseV1;
  try {
    const SANITIZED_SKILL = sanitizeOneForCreate(params)
    const RESPONSE = await client.assistant.createWorkspace(SANITIZED_SKILL);
    retVal = {
      skill: RESPONSE?.result,
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { userId, workspaceId });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const saveOne = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: ISaveAiSkillParamsV1,
): Promise<ISaveAiSkillResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let external: IAiSkillExternalV1WaV1;

  let retVal: ISaveAiSkillResponseV1;
  try {
    external = params?.value?.external as IAiSkillExternalV1WaV1;
    if (
      lodash.isEmpty(external?.workspace_id)
    ) {
      retVal = await _createOne(client, context, params);
    } else {
      retVal = await _updateOne(client, context, params);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
