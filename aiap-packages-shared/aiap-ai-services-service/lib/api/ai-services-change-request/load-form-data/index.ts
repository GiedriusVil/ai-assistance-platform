/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-change-request-load-form-data';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  createNewFormData
} from './create-new-form-data';

import {
  checkChangeRequestForIntent
} from './check-change-request-for-intent';

import {
  getAiServicesDatasourceByContext,
} from '../../utils/datasource-utils';

export const loadFormData = async (
  context: IContextV1,
  params: {
    value: {
      aiService: any,
      intentName: string
    }
  },
) => {
  try {
    let retVal;
    const INTENT_NAME = params?.value?.intentName;
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    const AI_SERVICE_CHANGE_REQUEST = await DATASOURCE.aiServicesChangeRequest.findOneByAiServiceAndAiSkillId(context, params);

    if (lodash.isEmpty(AI_SERVICE_CHANGE_REQUEST)) {
      retVal = createNewFormData(context, params);
    } else {
      const CHECK_CHANGE_REQUEST_PARAMS = {
        aiChangeRequest: AI_SERVICE_CHANGE_REQUEST,
        intentName:INTENT_NAME
      }
      retVal = checkChangeRequestForIntent(context, CHECK_CHANGE_REQUEST_PARAMS);
    }

    return retVal;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(loadFormData.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
