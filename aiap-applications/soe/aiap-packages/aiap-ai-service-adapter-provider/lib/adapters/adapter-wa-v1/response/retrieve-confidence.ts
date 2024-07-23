/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-service-client-provider-adapter-watson-assistant-v1-response-retrieve-confidence';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

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
  IRetrieveConfidenceParamsV1,
  IRetrieveConfidenceResponseV1,
} from '../../../types';

export const retrieveConfidence = async (
  context: ISoeContextV1,
  params: IRetrieveConfidenceParamsV1,
): Promise<IRetrieveConfidenceResponseV1> => {

  let external: IAiServiceResponseExternalV1WaV1;
  let intents: any;
  const RET_VAL: IRetrieveConfidenceResponseV1 = {
    confidence: 0.0,
  };
  try {
    external = params?.aiServiceResponse?.external as IAiServiceResponseExternalV1WaV1;
    intents = external?.result?.intents;
    RET_VAL.confidence = ramda.pathOr(
      0.0,
      [
        0,
        'confidence'
      ],
      intents,
    );
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveConfidence.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
