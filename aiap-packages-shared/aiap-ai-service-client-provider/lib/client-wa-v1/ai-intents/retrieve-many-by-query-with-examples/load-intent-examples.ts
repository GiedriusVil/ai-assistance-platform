/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-intents-retrieve-many-by-query-with-examples-load-intent-examples';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IAiIntentExternalV1WaV1,
  IAiIntentV1,
  IAiSkillExternalV1WaV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IRetrieveAiIntentsByQueryWithExamplesParamsV1
} from '../../../types';

import {
  AiServiceClientV1WaV1,
} from '../..'

export const loadIntentExamples = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IRetrieveAiIntentsByQueryWithExamplesParamsV1,
  intent: IAiIntentV1,
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let skillExternal: IAiSkillExternalV1WaV1;
  let intentExternal: IAiIntentExternalV1WaV1;

  try {
    skillExternal = params?.query?.filter?.aiSkill?.external as IAiSkillExternalV1WaV1;
    intentExternal = intent?.external as IAiIntentExternalV1WaV1;
    if (
      lodash.isEmpty(skillExternal?.workspace_id)
    ) {
      const MESSAGE = `Missing required params.aiSkill.external.workspace_id parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const REQUEST = {
      workspaceId: skillExternal?.workspace_id,
      intent: intentExternal?.intent,
      includeAudit: false,
      pageLimit: 1000,
    }
    const RESPONSE = await client.assistant.listExamples(REQUEST);
    intentExternal.examples = RESPONSE?.result?.examples;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(loadIntentExamples.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
