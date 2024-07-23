/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-intents-synchronise-within-ai-skill';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiSkillExternalV1WaV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISynchroniseAiIntentsWithinAiSkillParamsV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..'

import {
  retrieveManyByQueryWithExamples,
} from './retrieve-many-by-query-with-examples'

export const synchroniseWithinAiSkill = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: ISynchroniseAiIntentsWithinAiSkillParamsV1,
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let external: IAiSkillExternalV1WaV1;
  try {
    if (
      lodash.isEmpty(params?.aiSkill?.external)
    ) {
      const ERROR_MESSAGE = `Missing required params?.aiSkill?.external paraterter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    external = params?.aiSkill?.external as IAiSkillExternalV1WaV1;
    const PARAMS = {
      query: {
        filter: {
          aiSkill: params?.aiSkill,
        },
      },
    };
    const RESPONSE = await retrieveManyByQueryWithExamples(client, context, PARAMS);
    const INTENTS_EXTERNALS: Array<any> = [];
    if (
      !lodash.isEmpty(RESPONSE?.items) &&
      lodash.isArray(RESPONSE?.items)
    ) {
      for (const INTENT of RESPONSE.items) {
        if (
          !lodash.isEmpty(INTENT?.external)
        ) {
          INTENTS_EXTERNALS.push(INTENT?.external);
        }
      }
    }
    external.intents = INTENTS_EXTERNALS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(synchroniseWithinAiSkill.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
