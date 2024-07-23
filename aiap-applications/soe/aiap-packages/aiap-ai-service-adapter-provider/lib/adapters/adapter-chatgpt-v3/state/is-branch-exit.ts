/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-chatgpt-v3-state-is-branch-exist';
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
  try {
    const RET_VAL: IStateIsBranchExitResponseV1 = {
      value: true,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(isBranchExit.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

