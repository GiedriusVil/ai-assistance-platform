/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-sync-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IAiServiceClientV1,
} from '@ibm-aiap/aiap-ai-service-client-provider';

import {
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
  getAiServiceClientByAiService,
} from '@ibm-aiap/aiap-ai-service-client-provider';

import {
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';

import {
  recalculateTotals,
} from '../utils/ai-skills-utils';

import {
  findOneById as findAiServiceById,
} from '../ai-services';

import {
  findOneById as findAiSkillById,
} from './find-one-by-id';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

const _ensureAiSkillExternal = (
  aiSkill: IAiSkillV1,
) => {
  if (
    lodash.isEmpty(aiSkill.external)
  ) {
    aiSkill.external = {};
  }
}

const _ensureAiSkillTotals = (
  aiSkill: IAiSkillV1,
) => {
  if (
    lodash.isEmpty(aiSkill.totals)
  ) {
    aiSkill.totals = {};
  }
}

export const syncOneById = async (
  context: IContextV1,
  params: {
    id: any,
    options?: {
      syncIntents?: boolean,
      syncEntities?: boolean,
      syncDialogNodes?: boolean,
    },
  },
) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let aiService: IAiServiceV1;
  let aiServiceClient: IAiServiceClientV1;

  let aiSkill: IAiSkillV1;
  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const MESSAGE = `Missing required params?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    aiSkill = await findAiSkillById(context, { id: params?.id });
    if (
      lodash.isEmpty(aiSkill)
    ) {
      const MESSAGE = `Unable retrieve AI Skill!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(aiSkill?.aiServiceId)
    ) {
      const MESSAGE = `Unable to retrieve aiSkill?.aiServiceId attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    aiService = await findAiServiceById(context, { id: aiSkill?.aiServiceId });
    aiServiceClient = await getAiServiceClientByAiService(context, { aiService });
    if (
      lodash.isEmpty(aiServiceClient)
    ) {
      const MESSAGE = `Unable retrieve AI Service Provider!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    _ensureAiSkillExternal(aiSkill);
    _ensureAiSkillTotals(aiSkill);

    const AI_SERVICES_DATASOURCE = getAiServicesDatasourceByContext(context);

    await aiServiceClient.skills.syncOne(context, {
      aiSkill: aiSkill,
      options: params?.options,
    });

    recalculateTotals({
      aiServiceType: aiService?.type,
      aiSkill: aiSkill,
    });

    appendAuditInfo(context, aiSkill);

    aiSkill = await AI_SERVICES_DATASOURCE.aiSkills.saveOne(context, { value: aiSkill });
    const RET_VAL = aiSkill;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(syncOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
