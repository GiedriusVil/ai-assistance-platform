/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-pull-one-by-id-retrieve-pull-ai-skill';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IAiServiceV1,
  IAiSkillV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getAppDatasource,
} from '../../utils/datasource-utils';

import {
  findOneByAiServiceIdAndName as findAiSkillByAiServiceIdAndName,
} from '../find-one-by-ai-service-id-and-name';

export const retrievePullAISkill = async (
  context: IContextV1,
  params: {
    aiService: IAiServiceV1,
    aiSkill: IAiSkillV1,
    pullAiService: IAiServiceV1,
  },
) => {
  try {
    if (
      lodash.isEmpty(params?.aiService?.pullConfiguration?.tenantId)
    ) {
      const MESSAGE = `Missing required params.aiService.pullConfiguration.tenantId attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const APP_DATASOURCE = getAppDatasource();

    const PULL_SOURCE_TENANT = await APP_DATASOURCE.tenants.findOneById({},
      {
        id: params?.aiService?.pullConfiguration?.tenantId,
      });
    if (
      lodash.isEmpty(PULL_SOURCE_TENANT)
    ) {
      const MESSAGE = `Unable to retrieve pull tenant!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      lodash.isEmpty(params?.pullAiService?.id)
    ) {
      const MESSAGE = `Missing required params.pullAiService.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(params?.aiSkill?.name)
    ) {
      const MESSAGE = `Missing required params.aiSkill.name attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PULL_SOURCE_CONTEXT = {
      user: {
        session: {
          tenant: PULL_SOURCE_TENANT
        }
      }
    };
    const PARAMS = {
      aiServiceId: params?.pullAiService?.id,
      name: params?.aiSkill?.name,
    };
    const RET_VAL = await findAiSkillByAiServiceIdAndName(PULL_SOURCE_CONTEXT, PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrievePullAISkill.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
