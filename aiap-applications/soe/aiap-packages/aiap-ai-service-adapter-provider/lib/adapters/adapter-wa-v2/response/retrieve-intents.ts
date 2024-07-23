/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-wa-v2-response-retrieve-intents';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceResponseExternalV1WaV2,
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
  let external: IAiServiceResponseExternalV1WaV2;
  try {
    external = params?.aiServiceResponse?.external as IAiServiceResponseExternalV1WaV2;
    const RET_VAL: IRetrieveIntentsResponseV1 = {
      intents: external?.result?.output?.intents,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveIntents.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
