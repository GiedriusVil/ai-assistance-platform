/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-pull-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  pullOneById,
} from './pull-one-by-id';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';

export const pullManyByIds = async (
  context: IContextV1,
  params: {
    ids: Array<any>,
    aiServiceId: any,
  },
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    if (
      lodash.isEmpty(params?.aiServiceId)
    ) {
      const MESSAGE = `Missing required params?.aiServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(params?.ids)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isArray(params?.ids)
    ) {
      const MESSAGE = `Wrong type of params.ids parameter! [Array - expected]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (const AI_SKILL_ID of params.ids) {
      PROMISES.push(
        pullOneById(context,
          {
            aiSkillId: AI_SKILL_ID,
            aiServiceId: params?.aiServiceId
          })
      );
    }
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(pullManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
