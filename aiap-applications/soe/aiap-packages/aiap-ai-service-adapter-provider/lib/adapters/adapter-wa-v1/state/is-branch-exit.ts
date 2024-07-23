/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-service-client-provider-adapter-watson-assistant-v1-state-is-branch-exit';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IStateIsBranchExitParamsV1,
  IStateIsBranchExitResponseV1,
} from '../../../types';

export const isBranchExit = async (
  context: ISoeContextV1,
  params: IStateIsBranchExitParamsV1,
): Promise<IStateIsBranchExitResponseV1> => {
  let stateIbmWaV1;
  let retVal: IStateIsBranchExitResponseV1;
  try {
    stateIbmWaV1 = params?.update?.session?.state?.ibmWaV1;
    retVal = {
      value: stateIbmWaV1?.system?.branch_exited,
    };
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(isBranchExit.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
