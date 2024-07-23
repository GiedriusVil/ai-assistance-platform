/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-service-ai-services-sync-one-by-id-sync-one-with-aws-lex-v2';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IAiServiceV1,
  IAiSkillV1,
  IAiSkillExternalV1AwsLexV2,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceClientV1,
  getAiServiceClientByAiService,
} from '@ibm-aiap/aiap-ai-service-client-provider';

import {
  saveOne as saveAiSkill,
  findOneByAiServiceIdAndName as findAiSkillByAiServiceIdAndName,
} from '../../ai-skills';

import {
  recalculateTotals,
} from '../../utils/ai-skills-utils';

const _syncAiSkill = async (
  context: IContextV1,
  params: {
    aiService: IAiServiceV1,
    aiSkill: IAiSkillV1,
  },
) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let aiServiceId;
  let aiServiceType;

  let external: IAiSkillExternalV1AwsLexV2;

  let aiSkill;
  let aiSkillName;
  let aiSkillExternal;
  try {
    if (
      lodash.isEmpty(params?.aiService?.id)
    ) {
      const MESSAGE = `Missing required params?.aiService?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(params?.aiService?.type)
    ) {
      const MESSAGE = `Missing required params?.aiService?.type parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    aiServiceId = params?.aiService?.id;
    aiServiceType = params?.aiService?.type;
    external = params?.aiSkill?.external as IAiSkillExternalV1AwsLexV2;
    if (
      lodash.isEmpty(external?.botSummary?.botId)
    ) {
      const MESSAGE = `Missing required params?.external?.botSummary?.botId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(external?.locale?.localeId)
    ) {
      const MESSAGE = `Missing required params?.external?.locale?.localeId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    // TODO [LEGO] - If bot name is changed within AWS - it will create new skill record within AIAP!
    // Probably we will need to think about this
    aiSkillName = `${external?.botSummary?.botName}.${external?.locale?.localeId}`;
    aiSkill = await findAiSkillByAiServiceIdAndName(context, { aiServiceId: aiServiceId, name: aiSkillName });
    if (
      lodash.isEmpty(aiSkill)
    ) {
      aiSkill = {
        name: aiSkillName,
        aiServiceId: aiServiceId,
        external: external,
      }
    } else {
      aiSkillExternal = aiSkill?.external || {};
      aiSkill.external = {
        ...aiSkillExternal,
        ...external,
      };
    }
    recalculateTotals({
      aiServiceType,
      aiSkill,
    });
    const RET_VAL = await saveAiSkill(context, { value: aiSkill });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(_syncAiSkill.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _syncAiSkillsByAiService = async (
  context: IContextV1,
  params: {
    aiService: IAiServiceV1,
  },
) => {
  let aiServiceClient: IAiServiceClientV1;
  try {
    if (
      lodash.isEmpty(params?.aiService?.id)
    ) {
      const MESSAGE = `Mising required params?.aiService?.id paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(params?.aiService?.type)
    ) {
      const MESSAGE = `Mising required params?.aiService?.type paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    aiServiceClient = await getAiServiceClientByAiService(context, params);
    const RESPONSE = await aiServiceClient.skills.retrieveManyByQuery(context, params);
    const AI_SKILLS = RESPONSE?.items;
    const PROMISES = [];
    if (
      !lodash.isEmpty(AI_SKILLS) &&
      lodash.isArray(AI_SKILLS)
    ) {
      for (const AI_SKILL of AI_SKILLS) {
        if (
          !lodash.isEmpty(AI_SKILL)
        ) {
          PROMISES.push(_syncAiSkill(context, {
            aiService: params?.aiService,
            aiSkill: AI_SKILL,
          }));
        }
      }
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_syncAiSkillsByAiService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const syncOneWithAwsLexV2 = async (
  context: IContextV1,
  params: {
    aiService: IAiServiceV1
  },
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    if (
      lodash.isEmpty(params?.aiService)
    ) {
      const MESSAGE = `Missing required params.aiService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    await _syncAiSkillsByAiService(context, params);
    const RET_VAL = { status: 'SUCCESS' };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(syncOneWithAwsLexV2.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
