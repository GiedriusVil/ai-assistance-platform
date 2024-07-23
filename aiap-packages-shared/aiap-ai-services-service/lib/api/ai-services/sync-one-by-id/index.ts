/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-service-ai-services-sync-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
  IContextV1,
  IAiServiceV1,
  CHANGE_ACTION,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  findOneById as findAiServiceById,
} from '../find-one-by-id';

import { syncOneWithAwsLexV2 } from './sync-one-with-aws-lex-v2';
import { syncOneWithChatGptV3 } from './sync-one-with-chatgpt-v3';
import { syncOneWithWaV1 } from './sync-one-with-wa-v1';
import { syncOneWithWaV2 } from './sync-one-with-wa-v2';

import * as aiServicesChangesService from '../../ai-services-changes';

export const syncOneById = async (
  context: IContextV1,
  params: {
    id: any,
  }
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let aiService: IAiServiceV1;
  let retVal;
  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const MESSAGE = `Missing required params?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    aiService = await findAiServiceById(context, params);

    if (
      lodash.isEmpty(aiService?.id)
    ) {
      const MESSAGE = `It seems retrieved aiService is corrupted - missing aiService?.id value!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(aiService?.type)
    ) {
      const MESSAGE = `It seems retrieved aiService is corrupted - missing aiService?.type value!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const CHANGES_SERVICE_PARAMS = {
      value: aiService,
      docChanges: [],
      action: CHANGE_ACTION.SYNC_ONE,
    };

    await aiServicesChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);

    switch (aiService?.type) {
      case AI_SERVICE_TYPE_ENUM.AWS_LEX_V2:
        retVal = await syncOneWithAwsLexV2(context, { aiService });
        break;
      case AI_SERVICE_TYPE_ENUM.CHAT_GPT_V3:
        retVal = await syncOneWithChatGptV3(context, { aiService });
        break;
      case AI_SERVICE_TYPE_ENUM.WA_V1:
        retVal = await syncOneWithWaV1(context, { aiService });
        break;
      case AI_SERVICE_TYPE_ENUM.WA_V2:
        retVal = await syncOneWithWaV2(context, { aiService });
        break;
      default:
        retVal = { status: 'SUCCESS' };
        break;
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(syncOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
