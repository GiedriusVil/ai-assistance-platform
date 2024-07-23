/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-pull-one-by-id-retrieve-current-ai-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  findOneById as findAiServiceById,
} from '../../ai-services/find-one-by-id';

export const retrieveCurrentAiService = async (
  context: IContextV1,
  params: {
    aiServiceId: any,
  }
) => {
  try {
    if (
      lodash.isEmpty(params?.aiServiceId)
    ) {
      const MESSAGE = `Missing required params?.aiServiceId attribute`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = await findAiServiceById(context, { id: params?.aiServiceId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveCurrentAiService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
