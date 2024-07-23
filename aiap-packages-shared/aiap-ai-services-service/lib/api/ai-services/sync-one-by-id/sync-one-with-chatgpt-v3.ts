/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-service-ai-services-sync-one-by-id-sync-one-with-chatgpt-v3';
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
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';


export const syncOneWithChatGptV3 = async (
  context: IContextV1,
  params: {
    aiService: IAiServiceV1,
  }
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    if (
      lodash.isEmpty(params?.aiService)
    ) {
      const MESSAGE = `Missing required params.aiService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    logger.info(syncOneWithChatGptV3.name, { IMPLEMENTATION_TBD: true });
    const RET_VAL = { status: 'SUCCESS' };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(syncOneWithChatGptV3.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
