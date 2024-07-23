/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-watson-assistant-v2-response-retrieve-context';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

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
  IRetrieveContextParamsV1,
  IRetrieveContextResponseV1,
} from '../../../types';

export const retrieveContext = async (
  context: ISoeContextV1,
  params: IRetrieveContextParamsV1,
): Promise<IRetrieveContextResponseV1> => {
  let updateSessionContext;

  let external: IAiServiceResponseExternalV1WaV2;

  let responseContext;
  let tmpContext;

  let retVal: IRetrieveContextResponseV1;
  try {
    updateSessionContext = params?.update?.session?.context;

    external = params?.aiServiceResponse?.external as IAiServiceResponseExternalV1WaV2;

    responseContext = external?.result?.context;

    const MAIN_SKILL_CONTEXT = responseContext?.skills['main skill']?.user_defined || {};
    const ACTION_SKILL_CONTEXT = responseContext?.skills['actions skill']?.skill_variables || {};

    tmpContext = ramda.mergeDeepRight({}, MAIN_SKILL_CONTEXT || {});
    tmpContext = ramda.mergeDeepRight(tmpContext, ACTION_SKILL_CONTEXT || {});

    retVal = ramda.mergeDeepRight(updateSessionContext, tmpContext || {});

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
