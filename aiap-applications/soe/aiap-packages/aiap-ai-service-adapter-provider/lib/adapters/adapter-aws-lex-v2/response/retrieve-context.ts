/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-aws-lex-v2-response-retrieve-context';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceResponseExternalV1AwsLexV2,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
  ISoeUpdateSessionContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateSessionContext,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  IRetrieveContextParamsV1,
  IRetrieveContextResponseV1,
} from '../../../types';

export const retrieveContext = async (
  context: ISoeContextV1,
  params: IRetrieveContextParamsV1,
): Promise<IRetrieveContextResponseV1> => {

  let updateSessionContext: ISoeUpdateSessionContextV1;
  let external: IAiServiceResponseExternalV1AwsLexV2;
  let externalResultContext;

  let retVal: IRetrieveContextResponseV1;
  try {
    updateSessionContext = getUpdateSessionContext(params?.update);

    external = params?.aiServiceResponse?.external as IAiServiceResponseExternalV1AwsLexV2;
    externalResultContext = external?.result?.context;

    retVal = ramda.mergeDeepRight(updateSessionContext, externalResultContext?.skills?.user_defined || {});

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
