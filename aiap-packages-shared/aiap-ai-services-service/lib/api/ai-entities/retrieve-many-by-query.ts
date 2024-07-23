/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-service-ai-entities-retrieve-many-by-query';
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
  IAiServiceClientV1,
  IRetrieveAiEntitiesByQueryParamsV1,
  getAiServiceClientByAiService,
} from '@ibm-aiap/aiap-ai-service-client-provider';

import * as aiServicesService from '../ai-services';
import * as aiSkillsService from '../ai-skills';

export const retrieveManyByQuery = async (
  context: IContextV1,
  params: {
    query: {
      filter: {
        aiServiceId: any,
        aiSkillId: any,
      }
    }
  },
) => {

  let aiService: IAiServiceV1;
  let aiServiceClient: IAiServiceClientV1;

  let aiSkill: IAiSkillV1;

  try {
    if (
      lodash.isEmpty(params?.query?.filter?.aiServiceId)
    ) {
      const ERROR_MESSAGE = `Missing required params?.aiServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    aiService = await aiServicesService.findOneById(context,
      {
        id: params?.query?.filter?.aiServiceId,
      });
    aiServiceClient = await getAiServiceClientByAiService(context, { aiService });
    aiSkill = await aiSkillsService.findOneById(context,
      {
        id: params?.query?.filter?.aiSkillId,
      });

    const PARAMS: IRetrieveAiEntitiesByQueryParamsV1 = {
      query: {
        filter: {
          aiSkill: aiSkill,
        }
      },
    }
    const RET_VAL = await aiServiceClient.entities.retrieveManyByQuery(context, PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
