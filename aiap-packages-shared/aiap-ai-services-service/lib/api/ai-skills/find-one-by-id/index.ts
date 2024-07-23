/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-service-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiServiceV1,
  IAiSkillV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getAiServicesDatasourceByContext,
} from '../../utils/datasource-utils';

import { appendToTargetForAwsLexV2 } from './append-to-target-for-aws-lex-v2';
import { appendToTargetForIbmWaV1 } from './append-to-target-for-ibm-wa-v1';
import { appendToTargetForIbmWaV2 } from './append-to-target-for-ibm-wa-v2';

export const findOneById = async (
  context: IContextV1,
  params: {
    id: any,
    options?: {
      addActions?: boolean,
      addIntents?: boolean,
      addEntities?: boolean,
    },
  },
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let aiSkill: IAiSkillV1;
  let aiService: IAiServiceV1;
  try {
    const DATASOURCE = getAiServicesDatasourceByContext(context);

    aiSkill = await DATASOURCE.aiSkills.findOneById(context, params);
    if (
      lodash.isEmpty(aiSkill?.aiServiceId)
    ) {
      const ERROR_MESSAGE = `Missing required RET_VAL.aiServiceId attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    aiService = await DATASOURCE.aiServices.findOneById(context,
      {
        id: aiSkill?.aiServiceId,
      });
    if (
      lodash.isEmpty(aiService?.type)
    ) {
      const ERROR_MESSAGE = `Unable to retrieve aiService type!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE)
    }
    switch (aiService?.type) {
      case AI_SERVICE_TYPE_ENUM.AWS_LEX_V2:
        appendToTargetForAwsLexV2(context,
          {
            target: aiSkill,
            options: params?.options,
          });
        break;
      case AI_SERVICE_TYPE_ENUM.WA_V1:
        appendToTargetForIbmWaV1(context,
          {
            target: aiSkill,
            options: params?.options,
          });
        break;
      case AI_SERVICE_TYPE_ENUM.WA_V2:
        appendToTargetForIbmWaV2(context,
          {
            target: aiSkill,
            options: params?.options,
          });
        break;
      default:
        break;
    }
    const RET_VAL = aiSkill;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
