/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IStateIsBranchExitParamsV1,
  IStateIsBranchExitResponseV1,
} from '../../../types';

import {
  AiServiceAdapterV1WaV1,
} from '..';

import { isBranchExit } from './is-branch-exit';

export const _state = (
  adapter: AiServiceAdapterV1WaV1,
) => {
  const RET_VAL = {
    isBranchExit: async (
      context: ISoeContextV1,
      params: IStateIsBranchExitParamsV1,
    ): Promise<IStateIsBranchExitResponseV1> => {
      const RET_VAL = await isBranchExit(context, params);
      return RET_VAL;
    },
  };
  return RET_VAL;
}
