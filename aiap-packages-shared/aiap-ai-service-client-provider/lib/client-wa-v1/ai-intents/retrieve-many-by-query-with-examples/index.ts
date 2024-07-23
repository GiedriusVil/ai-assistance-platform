/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-intents-retrieve-many-by-query-with-examples';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IRetrieveAiIntentsByQueryWithExamplesParamsV1
} from '../../../types';

import {
  retrieveManyByQuery,
} from '../retrieve-many-by-query';

import {
  AiServiceClientV1WaV1,
} from '../..';

import {
  loadIntentExamples,
} from './load-intent-examples';

export const retrieveManyByQueryWithExamples = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IRetrieveAiIntentsByQueryWithExamplesParamsV1,
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    const RET_VAL = await retrieveManyByQuery(client, context, params);
    const PROMISES = [];
    if (
      lodash.isArray(RET_VAL?.items) &&
      !lodash.isEmpty(RET_VAL?.items)
    ) {
      for (const INTENT of RET_VAL.items) {
        PROMISES.push(
          loadIntentExamples(client, context, params, INTENT)
        );
      }
    }
    await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveManyByQueryWithExamples.name, { ACA_ERROR });
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    throw ACA_ERROR;
  }
}



