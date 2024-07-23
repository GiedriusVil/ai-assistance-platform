/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-aws-lex-v2-response-retrieve-state';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeContextV1,
  ISoeUpdateSessionStateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateSessionState,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  IRetrieveStateParamsV1,
} from '../../../types';

export const retrieveState = async (
  context: ISoeContextV1,
  params: IRetrieveStateParamsV1,
): Promise<ISoeUpdateSessionStateV1> => {

  let updateSessionState: ISoeUpdateSessionStateV1;

  let retVal: ISoeUpdateSessionStateV1;
  try {
    updateSessionState = getUpdateSessionState(params?.update);

    // TODO -> LEGO -> Return later for AWS Lex State Check!
    retVal.awsLexV2 = {};

    retVal = updateSessionState;
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveState.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
