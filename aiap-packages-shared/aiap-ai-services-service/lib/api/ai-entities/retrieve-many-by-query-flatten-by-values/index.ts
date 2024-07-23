/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-services-service-service-ai-intents-retrieve-flatten-entities-and-values';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IAiServiceV1,
  IAiSkillV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceClientV1,
  getAiServiceClientByAiService,
} from '@ibm-aiap/aiap-ai-service-client-provider';

import * as aiServicesService from '../../ai-services';
import * as aiSkillsService from '../../ai-skills';

import {
  flattenByValues,
} from './flatten-by-values';

export const retrieveManyByQueryFlattenByValues = async (
  context: IContextV1,
  params: {
    query: {
      filter: {
        aiServiceId: any,
        aiSkillId: any,
      },
    },
  },
) => {
  let aiService: IAiServiceV1;
  let aiServiceClient: IAiServiceClientV1;

  let aiSkill: IAiSkillV1;

  try {
    aiService = await aiServicesService.findOneById(context, { id: params?.query?.filter?.aiServiceId });
    aiSkill = await aiSkillsService.findOneById(context, { id: params?.query?.filter?.aiSkillId });
    aiServiceClient = await getAiServiceClientByAiService(context, { aiService });

    const PARAMS = {
      query: {
        filter: {
          aiSkill: aiSkill,
        },
      },
    }

    const RESPONSE = await aiServiceClient.entities.retrieveManyByQueryWithValues(context, PARAMS);
    const ITEMS = flattenByValues(RESPONSE?.items);
    const RET_VAL = {
      items: ITEMS
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveManyByQueryFlattenByValues.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

