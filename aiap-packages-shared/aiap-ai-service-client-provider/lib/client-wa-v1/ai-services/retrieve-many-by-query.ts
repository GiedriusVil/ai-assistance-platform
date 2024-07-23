/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-services-retrieve-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  appendDataToError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IRetrieveAiServicesByQueryParamsV1,
  IRetrieveAiServicesByQueryResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

export const retrieveManyByQuery = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IRetrieveAiServicesByQueryParamsV1,
): Promise<IRetrieveAiServicesByQueryResponseV1> => {
  let userId;

  let retVal: IRetrieveAiServicesByQueryResponseV1;
  try {
    userId = context?.user?.id;

    retVal = {};
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { userId });
    logger.error(retrieveManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
