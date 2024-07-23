/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-delete-many-by-ai-service-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  findManyLiteByQuery,
} from './find-many-lite-by-query';

import {
  deleteManyByIds,
} from './delete-many-by-ids';

export const deleteManyByAiServiceId = async (
  context: IContextV1,
  params: {
    aiServiceId: any,
  },
) => {
  const AI_SKILL_IDS = [];
  try {
    if (
      lodash.isEmpty(params?.aiServiceId)
    ) {
      const ERROR_MESSAGE = `Missing required params?.aiServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const PARAMS = {
      query: {
        filter: {
          aiServiceId: params?.aiServiceId
        },
        pagination: {
          page: 0,
          size: 9999
        }
      }
    }
    const RESULT = await findManyLiteByQuery(context, PARAMS);
    if (
      !lodash.isEmpty(RESULT?.items) &&
      lodash.isArray(RESULT?.items)
    ) {
      for (const AI_SKILL of RESULT.items) {
        if (
          !lodash.isEmpty(AI_SKILL?.id)
        ) {
          AI_SKILL_IDS.push(AI_SKILL?.id);
        }
      }
    }

    const RET_VAL: any = {};
    if (
      !lodash.isEmpty(AI_SKILL_IDS)
    ) {
      await deleteManyByIds(context, { ids: AI_SKILL_IDS });
    }
    RET_VAL.status = 'SUCCESS';
    RET_VAL.ids = AI_SKILL_IDS;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByAiServiceId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
