/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-pull-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IAiServiceV1,
  IAiSkillV1,
  IContextV1,
  IAiSkillExternalV1WaV1,
  AI_SERVICE_TYPE_ENUM,
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

import * as aiSkillReleasesService from '../../ai-skill-releases';

import {
  findOneById as findAiSkillById,
} from '../find-one-by-id';

import {
  saveOne as saveAiSkill,
} from '../save-one';

import {
  retrieveCurrentAiService,
} from './retrieve-current-ai-service';

import {
  retrieveAiServiceByPullConfiguration,
} from './retrieve-ai-service-by-pull-configuration';

import {
  retrievePullAISkill,
} from './retrieve-pull-ai-skill';

const updateDeploySkillExternalData = (
  pullAiService: IAiServiceV1,
  deployAiSkill: IAiSkillV1,
  aiSkill: IAiSkillV1
) => {
  let errorMessage = `Pull AI Skill of this AI Service type unsupported: ${pullAiService?.type}`;
  switch (pullAiService?.type) {
    case AI_SERVICE_TYPE_ENUM.AWS_LEX_V2:
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, errorMessage);
    case AI_SERVICE_TYPE_ENUM.CHAT_GPT_V3:
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, errorMessage);
    case AI_SERVICE_TYPE_ENUM.WA_V1:
      (deployAiSkill.external as IAiSkillExternalV1WaV1).workspace_id = (aiSkill.external as IAiSkillExternalV1WaV1).workspace_id;
      break;
    case AI_SERVICE_TYPE_ENUM.WA_V2:
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, errorMessage);
    default:
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, errorMessage);
  }
}

export const pullOneById = async (
  context: IContextV1,
  params: {
    aiSkillId: any,
    aiServiceId: any,
  },
) => {
  const USER_ID = ramda.path(['user', 'id'], context);
  const USER_NAME = ramda.path(['user', 'username'], context);

  let aiServiceClient: IAiServiceClientV1;
  let aiService: IAiServiceV1;
  let aiSkill: IAiSkillV1;

  let pullAiService: IAiServiceV1;
  let pullAiSkill: IAiSkillV1;

  let deployAiSkill;
  try {
    if (
      lodash.isEmpty(params?.aiSkillId)
    ) {
      const MESSAGE = `Missing required params.aiSkillId attribute`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    aiSkill = await findAiSkillById(context, { id: params?.aiSkillId });
    if (
      lodash.isEmpty(aiSkill)
    ) {
      const MESSAGE = `Unable to retrieve aiSkill!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    aiService = await retrieveCurrentAiService(context,
      {
        aiServiceId: aiSkill?.aiServiceId,
      });
    if (
      lodash.isEmpty(aiService)
    ) {
      const MESSAGE = `Unable to retrieve aiService!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    pullAiService = await retrieveAiServiceByPullConfiguration(context,
      {
        aiService: aiService,
      });
    if (
      lodash.isEmpty(aiService)
    ) {
      const MESSAGE = `Unable to retrieve pullAIService!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    pullAiSkill = await retrievePullAISkill(context,
      {
        aiService: aiService,
        aiSkill: aiSkill,
        pullAiService: pullAiService,
      });
    if (
      lodash.isEmpty(pullAiSkill)
    ) {
      const MESSAGE = `Unable to retrieve pullAiSkill!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    deployAiSkill = lodash.cloneDeep(pullAiSkill);

    const DATE = new Date();

    const CREATED_T = DATE.getTime();
    const DEPLOYED_T = DATE.getTime();

    deployAiSkill.id = aiSkill.id;
    deployAiSkill.version = CREATED_T;
    deployAiSkill.aiServiceId = aiSkill.aiServiceId;
    deployAiSkill.created = aiSkill.created;
    updateDeploySkillExternalData(pullAiService, deployAiSkill, aiSkill);

    aiServiceClient = await getAiServiceClientByAiService(context, { aiService: aiService });

    await aiServiceClient.skills.saveOne(context, { value: deployAiSkill });

    await saveAiSkill(context, { value: deployAiSkill });

    deployAiSkill.id = aiSkill.id;

    const AI_SKILL_RELEASE = {
      aiServiceId: aiService?.id,
      aiSkillId: aiSkill?.id,
      createdT: CREATED_T,
      created: {
        date: DATE,
        user: {
          id: USER_ID,
          name: USER_NAME,
        }
      },
      deployedT: DEPLOYED_T,
      deployed: {
        date: DATE,
        user: {
          id: USER_ID,
          name: USER_NAME,
        }
      },
      versions: {
        source: pullAiSkill,
        current: aiSkill,
        deployed: deployAiSkill
      }
    };
    await aiSkillReleasesService.saveOne(context,
      {
        value: AI_SKILL_RELEASE,
      });
    const RET_VAL =
    {
      status: 'SUCCESS'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID });
    logger.error(pullOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
