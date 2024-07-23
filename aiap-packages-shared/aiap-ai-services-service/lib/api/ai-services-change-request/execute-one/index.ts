/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-service-execute-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IAiServiceChangeRequestV1
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiSkillExternalV1WaV2
} from '@ibm-aiap/aiap--types-server';

import {
  getAiServiceClientByAiService
} from '@ibm-aiap/aiap-ai-service-client-provider';


import { getAiServicesDatasourceByContext } from '../../utils/datasource-utils';

import * as aiSkillReleasesService from '../../ai-skill-releases';


export const executeOne = async (
  context: IContextV1,
  params: {
    value: IAiServiceChangeRequestV1
  },
) => {

  try {
    const USER_ID = context?.user?.id;
    const USER_NAME = context?.user?.username;
    const VALUE = params?.value;
    const AI_SERVICE_ID = VALUE?.aiService?.id;
    const AI_SKILL_ID = VALUE?.aiService?.aiSkill?.id;
    const INTENTS = VALUE?.intents;
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    const AI_SERVICE = await DATASOURCE.aiServices.findOneById(context, { id: AI_SERVICE_ID });

    if (
      lodash.isEmpty(AI_SERVICE)
    ) {
      const MESSAGE = `Unable to retrieve aiService!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const AI_SKILL = await DATASOURCE.aiSkills.findOneById(context, { id: AI_SKILL_ID });

    if (
      lodash.isEmpty(AI_SKILL)
    ) {
      const MESSAGE = `Unable to retrieve aiSkill!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const EXTERNAL_AI_SKILL_ID = (AI_SKILL?.external as IAiSkillExternalV1WaV2)?.skill_id;
    VALUE.aiService.aiSkill.externalId = EXTERNAL_AI_SKILL_ID;

    const AI_SERVICE_CLIENT = await getAiServiceClientByAiService(context, {
      aiService: AI_SERVICE
    });

    const SKILLS = await AI_SERVICE_CLIENT.changeRequest.retrieveSkill(context, {
      aiService: VALUE?.aiService
    })

    const ACTION_SKILL = SKILLS?.actionSkill;
    const DIALOG_SKILL = SKILLS?.dialogSkill;

    const ACTION_SKILL_WITH_FORMATTED_INTENTS = await AI_SERVICE_CLIENT.changeRequest.formatIntents(context, {
      skill: ACTION_SKILL,
      intents: INTENTS
    })

    const ASSISTANT_STATE = {
      action_disabled: false,
      dialog_disabled: false
    };

    await AI_SERVICE_CLIENT.changeRequest.importSkills(context, {
      assistantSkills: [ACTION_SKILL_WITH_FORMATTED_INTENTS, DIALOG_SKILL],
      assistantState: ASSISTANT_STATE
    });

    await DATASOURCE.aiServicesChangeRequest.saveOne(context, params);

    const AI_SKILL_SAVE_OBJ = lodash.cloneDeep(AI_SKILL);
    const UPDATED_SKILL_INTENTS = ACTION_SKILL_WITH_FORMATTED_INTENTS?.workspace?.intents;
    AI_SKILL_SAVE_OBJ.external.workspace.intents = UPDATED_SKILL_INTENTS;

    await DATASOURCE.aiSkills.saveOne(context, {
      value: AI_SKILL_SAVE_OBJ
    });

    const DATE = new Date();
    const CREATED_T = DATE.getTime();
    const DEPLOYED_T = DATE.getTime();
    const DEPLOY_AI_SKILL = lodash.cloneDeep(AI_SKILL);
    DEPLOY_AI_SKILL.version = CREATED_T;
    DEPLOY_AI_SKILL.external.workspace.intents = UPDATED_SKILL_INTENTS;

    const AI_SKILL_RELEASE = {
      aiServiceId: AI_SERVICE?.id,
      aiSkillId: AI_SKILL?.id,
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
        source: AI_SKILL,
        current: AI_SKILL,
        deployed: DEPLOY_AI_SKILL
      }
    };
    await aiSkillReleasesService.saveOne(context,
      {
        value: AI_SKILL_RELEASE,
      });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(executeOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
