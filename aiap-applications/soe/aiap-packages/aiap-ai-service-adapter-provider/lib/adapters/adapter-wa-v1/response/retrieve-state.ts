/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-service-client-provider-adapter-watson-assistant-v1-response-retrieve-state';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getUpdateSessionState,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  IAiServiceResponseExternalV1WaV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
  ISoeUpdateSessionStateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IRetrieveStateParamsV1,
} from '../../../types';

export const retrieveState = async (
  context: ISoeContextV1,
  params: IRetrieveStateParamsV1,
): Promise<ISoeUpdateSessionStateV1> => {

  let updateSessionState;

  let external: IAiServiceResponseExternalV1WaV1;

  let externalResultContext;

  let retVal: ISoeUpdateSessionStateV1;
  try {
    updateSessionState = getUpdateSessionState(params?.update);
    external = params?.aiServiceResponse?.external as IAiServiceResponseExternalV1WaV1;
    externalResultContext = external?.result?.context;
    if (
      lodash.isEmpty(updateSessionState?.ibmWaV1)
    ) {
      updateSessionState.ibmWaV1 = {};
    }
    if (
      externalResultContext?.system
    ) {
      updateSessionState.ibmWaV1.system = externalResultContext?.system;
    }
    if (
      externalResultContext?.metadata
    ) {
      updateSessionState.ibmWaV1.metadata = externalResultContext?.metadata;
    }
    if (
      externalResultContext?.conversation_id
    ) {
      updateSessionState.ibmWaV1.conversation_id = externalResultContext?.conversation_id;
    }
    retVal = updateSessionState;
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveState.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

