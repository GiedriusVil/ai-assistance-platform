/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-entities-retrieve-many-by-query-with-values';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IRetrieveAiEntitiesByQueryWithValuesParamsV1,
  IRetrieveAiEntitiesByQueryWithValuesResponseV1,
} from '../../../types';

import {
  retrieveManyByQuery,
} from '../retrieve-many-by-query';

import {
  AiServiceClientV1WaV1,
} from '../..';

import {
  loadEntityValues,
} from './load-entity-values'

export const retrieveManyByQueryWithValues = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IRetrieveAiEntitiesByQueryWithValuesParamsV1,
): Promise<IRetrieveAiEntitiesByQueryWithValuesResponseV1> => {
  try {
    const RET_VAL = await retrieveManyByQuery(client, context, params);
    const PROMISES = [];

    if (
      !lodash.isEmpty(RET_VAL?.items)
    ) {
      for (const ENTITY of RET_VAL.items) {
        PROMISES.push(loadEntityValues(client, context, params, ENTITY));
      }
    }
    await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveManyByQueryWithValues.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

