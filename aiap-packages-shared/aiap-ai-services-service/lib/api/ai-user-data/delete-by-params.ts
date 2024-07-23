/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-user-data-delete-by-params';
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
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';

import {
  IAiServiceClientV1,
  getAiServiceClientByAiService,
} from '@ibm-aiap/aiap-ai-service-client-provider';

export const deleteByParams = async (
  context: IContextV1,
  params: {
    aiServiceId: any,
    userId: any,
    conversationId: any,
  },
) => {

  let aiService: IAiServiceV1;
  let aiServiceClient: IAiServiceClientV1;

  try {
    if (
      lodash.isEmpty(params?.aiServiceId)
    ) {
      const MESSAGE = `Missing required params?.aiServiceId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    aiService = await DATASOURCE.aiServices.findOneById(context,
      {
        id: params?.aiServiceId,
      });
    aiServiceClient = await getAiServiceClientByAiService(context,
      {
        aiService: aiService,
      });

    if (
      !lodash.isEmpty(params?.userId)
    ) {
      await aiServiceClient.userData.deleteManyByUserId(context,
        {
          userId: params?.userId,
        });
    }
    if (
      !lodash.isEmpty(params?.conversationId)
    ) {
      await aiServiceClient.userData.deleteManyByConversationId(context,
        {
          conversationId: params?.conversationId,
        });
    }
    const RET_VAL = {
      status: 'SUCCESS',
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteByParams.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
