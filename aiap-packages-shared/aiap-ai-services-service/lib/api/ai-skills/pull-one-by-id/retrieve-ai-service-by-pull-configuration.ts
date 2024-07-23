/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-pull-one-by-id-retrieve-ai-service-by-pull-configuration';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IAiServiceV1,
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
  findOneById as findAiServiceById,
} from '../../ai-services/find-one-by-id';

export const retrieveAiServiceByPullConfiguration = async (
  context: IContextV1,
  params: {
    aiService: IAiServiceV1,
  },
) => {
  try {
    const APP_DATASOURCE = getAppDatasource();
    const PULL_SOURCE_TENANT = await APP_DATASOURCE.tenants.findOneById({},
      {
        id: params?.aiService?.pullConfiguration?.tenantId
      });
    if (
      lodash.isEmpty(PULL_SOURCE_TENANT)
    ) {
      const MESSAGE = `Missing required pull source tenant!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(params?.aiService?.pullConfiguration?.tenantId)
    ) {
      const MESSAGE = `Missing required params?.aiService?.pullConfiguration?.tenantId attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(params?.aiService?.pullConfiguration?.assistantId)
    ) {
      const MESSAGE = `Missing required params?.aiService?.pullConfiguration?.assistantId attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(params?.aiService?.pullConfiguration?.aiServiceId)
    ) {
      const MESSAGE = `Missing required params.aiService.pullConfiguration.aiServiceId attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PULL_SOURCE_CONTEXT = {
      user: {
        session: {
          tenant: PULL_SOURCE_TENANT
        }
      }
    };
    const RET_VAL = await findAiServiceById(PULL_SOURCE_CONTEXT, {
      id: params?.aiService?.pullConfiguration?.aiServiceId,
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveAiServiceByPullConfiguration.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
