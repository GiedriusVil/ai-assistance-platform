/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-chatgpt-v3-response-retrieve-context';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IRetrieveContextParamsV1,
  IRetrieveContextResponseV1,
} from '../../../types';

export const retrieveContext = async (
  context: ISoeContextV1,
  params: IRetrieveContextParamsV1,
): Promise<IRetrieveContextResponseV1> => {
  let response;
  let retVal: IRetrieveContextResponseV1;
  try {
    response = params?.aiServiceResponse;
    retVal = params?.update?.session?.context;
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveContext.name, { ACA_ERROR, response });
    throw ACA_ERROR;
  }
}
