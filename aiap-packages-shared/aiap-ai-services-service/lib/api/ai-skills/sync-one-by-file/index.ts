/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-sync-one-by-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
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
  readJsonFromFile,
} from '@ibm-aiap/aiap-utils-file';

import {
  getAiServicesDatasourceByContext,
} from '../../utils/datasource-utils';

import {
  recalculateTotals,
} from '../../utils/ai-skills-utils';

import * as runtimeDataService from '../../runtime-data';

import {
  findOneByAiServiceIdAndName as findAiSkillByAiServiceIdAndName,
} from '../find-one-by-ai-service-id-and-name';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

export const syncOneByFile = async (
  context: IContextV1,
  params: {
    aiService: {
      id: any,
      type: AI_SERVICE_TYPE_ENUM,
    },
    file: any,
  },
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const FILE = params?.file;

  let aiSkillName: any;
  let aiSkill: IAiSkillV1;

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
      const MESSAGE = `Missing required params.aiServiceType parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const AI_SKILL_EXTERNAL_FROM_FILE = await readJsonFromFile(FILE);
    if (
      lodash.isEmpty(AI_SKILL_EXTERNAL_FROM_FILE)
    ) {
      const MESSAGE = `Provided file doesn't contain any data!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    aiSkillName = AI_SKILL_EXTERNAL_FROM_FILE?.name;

    aiSkill = await findAiSkillByAiServiceIdAndName(context,
      {
        aiServiceId: params?.aiService?.id,
        name: aiSkillName
      });

    if (
      lodash.isEmpty(aiSkill)
    ) {
      aiSkill = {
        name: aiSkillName,
        type: params?.aiService?.type,
        aiServiceId: params?.aiService?.id,
        external: {
          ...AI_SKILL_EXTERNAL_FROM_FILE,
        },
      }
    } else {
      const AI_SKILL_EXTERNAL = aiSkill.external;
      aiSkill.external = {
        ...AI_SKILL_EXTERNAL,
        ...AI_SKILL_EXTERNAL_FROM_FILE,
      };
    }

    recalculateTotals({
      aiServiceType: params?.aiService?.type,
      aiSkill: aiSkill,
    });

    appendAuditInfo(context, aiSkill);

    const DATASOURCE = getAiServicesDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiSkills.saveOne(context, { value: aiSkill });

    await runtimeDataService.synchronizeWithConfigDirectoryAiSkill(context, { value: RET_VAL });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(syncOneByFile.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
