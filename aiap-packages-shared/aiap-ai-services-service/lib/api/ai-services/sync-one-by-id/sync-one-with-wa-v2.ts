/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-service-ai-services-sync-one-by-id-sync-one-with-wa-v2';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
  IAiServiceV1,
  IAiSkillV1,
  AI_SERVICE_TYPE_ENUM,
  IAiSkillExternalV1WaV2,
} from '@ibm-aiap/aiap--types-server';

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

  let external: IAiSkillExternalV1WaV2;

  let aiSkill;
  let aiSkillName;

  let aiSkillExternal;
  try {
    external = params?.aiSkill?.external as IAiSkillExternalV1WaV2;
    if (
      lodash.isEmpty(params?.aiService?.id)
    ) {
      const MESSAGE = `Missing required params?.aiService?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(external?.name)
    ) {
      const MESSAGE = `Missing required params?.aiSkill?.external?.name parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(external?.type)
    ) {
      const MESSAGE = `Missing required params?.aiSkill?.external?.type parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    aiSkillName = `${external?.name}.${external?.type}`;
    aiSkill = await findAiSkillByAiServiceIdAndName(context,
      {
        aiServiceId: params?.aiService?.id,
        name: aiSkillName,
      });
    if (
      lodash.isEmpty(aiSkill)
    ) {
      aiSkill = {
        name: aiSkillName,
        aiServiceId: params?.aiService?.id,
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
      aiServiceType: AI_SERVICE_TYPE_ENUM.WA_V2,
      aiSkill: aiSkill,
    });
    const RET_VAL = await saveAiSkill(context, { value: aiSkill });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID })
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
          PROMISES.push(_syncAiSkill(context,
            {
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

export const syncOneWithWaV2 = async (
  context: IContextV1,
  params: {
    aiService: IAiServiceV1,
  }
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    if (
      lodash.isEmpty(params?.aiService)
    ) {
      const MESSAGE = `Missing required params?.aiService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    await _syncAiSkillsByAiService(context, params);
    const RET_VAL = { status: 'SUCCESS' };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(syncOneWithWaV2.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
