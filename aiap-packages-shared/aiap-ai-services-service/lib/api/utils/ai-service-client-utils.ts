/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-service-client-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IAiServiceV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  getAiServiceClientByAiService as _getAiServiceClientByAiServices,
} from '@ibm-aiap/aiap-ai-service-client-provider';

export const getAiServiceClientByAiService = async (
  context: IContextV1,
  params: {
    aiService: IAiServiceV1,
  }
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    const RET_VAL = await _getAiServiceClientByAiServices(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(getAiServiceClientByAiService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
