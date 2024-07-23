/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-service-client-provider-adapter-watson-assistant-v2-response-retrieve-state';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceResponseExternalV1WaV2,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
  ISoeUpdateSessionStateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateSessionState,
  getUpdateSession,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  IRetrieveStateParamsV1,
} from '../../../types';

export const retrieveState = async (
  context: ISoeContextV1,
  params: IRetrieveStateParamsV1,
): Promise<ISoeUpdateSessionStateV1> => {
  let update;
  let updateSession;
  let updateSessionState;

  let external: IAiServiceResponseExternalV1WaV2;

  let aiServiceId;
  let aiServiceResponseContext;
  let aiServiceResponseDebug;

  let retVal: ISoeUpdateSessionStateV1;
  try {
    update = params?.update;
    updateSession = getUpdateSession(update);
    updateSessionState = getUpdateSessionState(update);

    aiServiceId = updateSession?.aiService?.id;
    if (
      lodash.isEmpty(aiServiceId)
    ) {
      const ERROR_MESSAGE = `[${retrieveState.name}] Missing required update?.session?.aiService?.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    external = params?.aiServiceResponse?.external as IAiServiceResponseExternalV1WaV2;
    aiServiceResponseContext = lodash.cloneDeep(external?.result?.context);
    if (
      lodash.isEmpty(updateSessionState?.ibmWaV2)
    ) {
      updateSessionState.ibmWaV2 = {};
    }
    if (
      lodash.isEmpty(updateSessionState?.ibmWaV2[aiServiceId])
    ) {
      updateSessionState.ibmWaV2[aiServiceId] = {};
    }
    updateSessionState.ibmWaV2[aiServiceId].global = aiServiceResponseContext?.global;
    updateSessionState.ibmWaV2[aiServiceId].skills = {};
    updateSessionState.ibmWaV2[aiServiceId].skills = aiServiceResponseContext?.skills;
    if (
      updateSessionState?.ibmWaV2[aiServiceId]?.skills?.user_defined
    ) {
      delete updateSessionState.ibmWaV2[aiServiceId].skills.user_defined;
    }
    aiServiceResponseDebug = lodash.cloneDeep(external?.result?.output?.debug);
    updateSessionState.ibmWaV2[aiServiceId].debug = aiServiceResponseDebug;
    retVal = updateSessionState;
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveState.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
