/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-service-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IAiServiceChangeRequestV1
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  getAiServicesDatasourceByContext,
  getAcaConversationsDatasourceByContext
} from '../utils/datasource-utils';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

export const saveOne = async (
  context: IContextV1,
  params: {
    value: IAiServiceChangeRequestV1,
  },
) => {
  const USER_ID = context?.user?.id;
  const UTTERANCE_ID = params?.value?.utteranceId;
  const CHANGE_REQUEST_ID = params?.value?.id;
  let aiServicesChangeRequest;
  let utterance;
  let aiServiceId;
  try {
    appendAuditInfo(context, params?.value);
    const AI_SERVICE_DATASOURCE = getAiServicesDatasourceByContext(context);
    const CONVERSATIONS_DATASOURCE = getAcaConversationsDatasourceByContext(context)
    aiServicesChangeRequest = await AI_SERVICE_DATASOURCE.aiServicesChangeRequest.saveOne(context, params);
    utterance = await CONVERSATIONS_DATASOURCE.utterances.findOneById(context, { id: UTTERANCE_ID });
    utterance.aiChangeRequest = {
      id: aiServicesChangeRequest?.id
    };
    await CONVERSATIONS_DATASOURCE.utterances.saveOne(context, { utterance: utterance });
    const RET_VAL = aiServicesChangeRequest;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, aiServiceId });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
