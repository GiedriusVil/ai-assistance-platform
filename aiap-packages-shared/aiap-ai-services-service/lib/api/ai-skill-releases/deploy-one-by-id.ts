/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skill-releases-deploy-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IAiServiceV1,
  IAiSkillReleaseV1,
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
  IAiServiceClientV1,
  getAiServiceClientByAiService,
} from '@ibm-aiap/aiap-ai-service-client-provider';

import {
  findOneById as findAiServiceById,
} from '../ai-services';

import {
  saveOne as saveAiSkill,
} from '../ai-skills';

import {
  findOneById as findAiSkillReleaseById,
} from './find-one-by-id';

import {
  saveOne as saveAiSkillRelease,
} from './save-one'


export const deployOneById = async (
  context: IContextV1,
  params: {
    id: any,
  }
) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let aiSkillRelease: IAiSkillReleaseV1;

  let deployedAiSkill: IAiSkillV1;
  let deployedAiSkillAiService: IAiServiceV1;
  let deployedAiSkillAiServiceClient: IAiServiceClientV1;

  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    aiSkillRelease = await findAiSkillReleaseById(context, params);
    if (
      lodash.isEmpty(aiSkillRelease)
    ) {
      const MESSAGE = `Unable to retrieve aiSkillRelease!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    deployedAiSkill = aiSkillRelease?.versions?.deployed;
    if (
      lodash.isEmpty(deployedAiSkill)
    ) {
      const MESSAGE = `Unable to identify deployedAiSkill!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    deployedAiSkillAiService = await findAiServiceById(context,
      {
        id: deployedAiSkill?.aiServiceId,
      });
    if (
      lodash.isEmpty(deployedAiSkillAiService)
    ) {
      const MESSAGE = `Unable to retrieve deployedAiSkillAiService!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    deployedAiSkillAiServiceClient = await getAiServiceClientByAiService(context,
      {
        aiService: deployedAiSkillAiService,
      });

    if (
      lodash.isEmpty(deployedAiSkillAiServiceClient)
    ) {
      const MESSAGE = `Unable to retrieve deployedAiSkillAiServiceClient!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const DATE = new Date();

    await deployedAiSkillAiServiceClient.skills.saveOne(context,
      {
        value: deployedAiSkill
      });

    aiSkillRelease.deployedT = DATE.getTime();
    aiSkillRelease.deployed = {
      date: DATE,
      user: {
        id: context?.user?.id,
        name: context?.user?.username,
      }
    };

    await saveAiSkillRelease(context, { value: aiSkillRelease });
    await saveAiSkill(context, { value: deployedAiSkill });

    const RET_VAL = { status: 'SUCCESS' };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(deployOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
