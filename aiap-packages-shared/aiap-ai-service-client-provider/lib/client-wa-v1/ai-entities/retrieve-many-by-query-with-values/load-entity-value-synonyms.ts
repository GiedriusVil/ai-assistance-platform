/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-entities-retrieve-many-by-query-with-values-load-entity-value-synonyms';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

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
  IRetrieveAiEntitiesByQueryWithValuesParamsV1,
} from '../../../types';

import {
  AiServiceClientV1WaV1,
} from '../..'

const sanitizeSynonyms = (
  synonyms: Array<any>,
) => {
  const RET_VAL = [];
  synonyms.forEach(synonym => {

    const SYNONYM_VALUE = synonym?.synonym;
    if (
      !lodash.isEmpty(SYNONYM_VALUE)
    ) {
      RET_VAL.push(SYNONYM_VALUE);
    }
  });
  return RET_VAL;
}

export const loadEntityValueSynonyms = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IRetrieveAiEntitiesByQueryWithValuesParamsV1,
  entity: IAiEntityV1,
  value: any,
) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let skillExternal: IAiSkillExternalV1WaV1;
  let entityExternal: IAiEntityExternalV1WaV1;

  try {
    skillExternal = params?.query?.filter?.aiSkill?.external as IAiSkillExternalV1WaV1;
    entityExternal = entity?.external as IAiEntityExternalV1WaV1;

    const REQUEST = {
      workspaceId: skillExternal?.workspace_id,
      entity: entityExternal?.entity,
      value: value.value,
      pageLimit: 2000,
    }
    const RESPONSE = await client.assistant.listSynonyms(REQUEST);

    const SYNONYMS = RESPONSE?.result?.synonyms;
    const SANITIZED_SYNONYMS = sanitizeSynonyms(SYNONYMS);

    value.synonyms = SANITIZED_SYNONYMS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(loadEntityValueSynonyms.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
