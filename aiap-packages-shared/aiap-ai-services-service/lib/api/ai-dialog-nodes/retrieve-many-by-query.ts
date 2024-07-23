/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-service-ai-dialog-nodes-retrieve-dialog-nodes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IAiServiceV1,
  IAiSkillV1,
  IContextV1,
  IQueryPaginationV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceClientV1,
  getAiServiceClientByAiService,
  IRetrieveAiDialogNodesByQueryParamsV1,
} from '@ibm-aiap/aiap-ai-service-client-provider';

import * as aiServicesService from '../ai-services';

export const retrieveManyByQuery = async (
  context: IContextV1,
  params: {
    query: {
      filter: {
        aiServiceId: any,
        aiSkill: IAiSkillV1,
      },
      pagination: IQueryPaginationV1,
    },
  },
) => {

  let aiService: IAiServiceV1;
  let aiServiceClient: IAiServiceClientV1;
  try {
    aiService = await aiServicesService.findOneById(context, { id: params?.query?.filter?.aiServiceId });
    aiServiceClient = await getAiServiceClientByAiService(context, { aiService });

    const PARAMS: IRetrieveAiDialogNodesByQueryParamsV1 = {
      query: params?.query,
    }

    const RET_VAL = await aiServiceClient.dialogNodes.retrieveManyByQuery(context, PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
