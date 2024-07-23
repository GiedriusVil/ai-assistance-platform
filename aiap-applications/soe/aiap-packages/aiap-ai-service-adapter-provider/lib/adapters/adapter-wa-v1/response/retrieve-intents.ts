/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-service-client-provider-adapter-watson-assistant-v1-response-retrieve-intents';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceResponseExternalV1WaV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IRetrieveIntentsParamsV1,
  IRetrieveIntentsResponseV1,
} from '../../../types';

export const retrieveIntents = async (
  context: ISoeContextV1,
  params: IRetrieveIntentsParamsV1,
): Promise<IRetrieveIntentsResponseV1> => {

  let external: IAiServiceResponseExternalV1WaV1

  try {
    external = params?.aiServiceResponse?.external as IAiServiceResponseExternalV1WaV1;

    const RET_VAL: IRetrieveIntentsResponseV1 = {
      intents: external?.result?.intents,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveIntents.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
