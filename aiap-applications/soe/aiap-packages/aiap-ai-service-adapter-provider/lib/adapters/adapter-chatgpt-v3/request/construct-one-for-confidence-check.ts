/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-chatgpt-v3-request-construct-one-for-confidence-check';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceRequestV1,
  IAiServiceRequestExternalV1ChatGptV3,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IConstructRequestForConfidenceCheckParamsV1,
} from '../../../types';

export const constructOneForConfidenceCheck = async (
  context: ISoeContextV1,
  params: IConstructRequestForConfidenceCheckParamsV1,
): Promise<IAiServiceRequestV1> => {
  let external: IAiServiceRequestExternalV1ChatGptV3;
  let retVal: IAiServiceRequestV1;
  try {
    external = null;
    retVal = {
      type: params?.aiService?.type,
      version: params?.aiService?.version,
      external: external,
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOneForConfidenceCheck.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
