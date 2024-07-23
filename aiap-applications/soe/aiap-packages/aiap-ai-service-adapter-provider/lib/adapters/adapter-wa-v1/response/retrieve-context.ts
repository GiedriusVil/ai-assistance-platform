/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-service-client-provider-adapter-watson-assistant-v1-response-retrieve-context';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
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
  IRetrieveContextParamsV1,
  IRetrieveContextResponseV1,
} from '../../../types';

export const retrieveContext = async (
  context: ISoeContextV1,
  params: IRetrieveContextParamsV1,
): Promise<IRetrieveContextResponseV1> => {

  let updateSessionContext;
  let external: IAiServiceResponseExternalV1WaV1;
  let responseContext;

  let retVal;
  try {
    updateSessionContext = params?.update?.session?.context;
    external = params?.aiServiceResponse?.external as IAiServiceResponseExternalV1WaV1;

    responseContext = external?.result?.context;
    responseContext = lodash.cloneDeep(responseContext);

    if (
      responseContext?.system
    ) {
      delete responseContext.system;
    }
    if (
      responseContext?.metadata
    ) {
      delete responseContext.metadata;
    }
    if (
      responseContext?.conversation_id
    ) {
      delete responseContext.conversation_id;
    }
    retVal = ramda.mergeDeepRight(updateSessionContext, responseContext);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
