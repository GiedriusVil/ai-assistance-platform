/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-entities-retrieve-many-by-query-with-values-load-entity-values';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiEntityExternalV1WaV1,
  IAiEntityV1,
  IAiSkillExternalV1WaV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  AssistantV1,
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import {
  IRetrieveAiEntitiesByQueryWithValuesParamsV1,
} from '../../../types';

import {
  loadEntityValueSynonyms,
} from './load-entity-value-synonyms';

import {
  AiServiceClientV1WaV1,
} from '../..'

export const loadEntityValues = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IRetrieveAiEntitiesByQueryWithValuesParamsV1,
  entity: IAiEntityV1,
) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let skillExternal: IAiSkillExternalV1WaV1;
  let entityExternal: IAiEntityExternalV1WaV1;

  let response: AssistantV1.Response<AssistantV1.ValueCollection>;
  try {
    skillExternal = params?.query?.filter?.aiSkill?.external as IAiSkillExternalV1WaV1;
    entityExternal = entity?.external as IAiEntityExternalV1WaV1;

    const REQUEST = {
      workspaceId: skillExternal?.workspace_id,
      entity: entityExternal?.entity,
      pageLimit: 1000,
    }
    try {
      response = await client.assistant.listValues(REQUEST);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      throw ACA_ERROR;
    }

    const VALUES = response?.result?.values;

    const PROMISES = [];

    for (const VALUE of VALUES) {
      PROMISES.push(loadEntityValueSynonyms(client, context, params, entity, VALUE));
    }
    await Promise.all(PROMISES);

    entityExternal.values = VALUES;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(loadEntityValues.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
