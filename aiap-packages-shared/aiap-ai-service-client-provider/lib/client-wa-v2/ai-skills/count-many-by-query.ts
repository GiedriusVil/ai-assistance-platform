/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v2-ai-skills-count-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ICountAiSkillsByQueryParamsV1,
  ICountAiSkillsByQueryResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV2,
} from '..';

export const countManyByQuery = async (
  client: AiServiceClientV1WaV2,
  context: IContextV1,
  params: ICountAiSkillsByQueryParamsV1,
): Promise<ICountAiSkillsByQueryResponseV1> => {
  const RET_VAL: ICountAiSkillsByQueryResponseV1 = {
    count: 0,
  }
  try {
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(countManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR
  }
}
