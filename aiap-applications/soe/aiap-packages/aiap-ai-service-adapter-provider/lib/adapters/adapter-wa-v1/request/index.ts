/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiServiceRequestV1,
  IAiServiceResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IConstructRequestForConfidenceCheckParamsV1,
  IConstructRequestParamsV1,
  ISendRequestForConfidenceCheckParamsV1,
  ISendRequestParamsV1,
} from '../../../types';

import {
  AiServiceAdapterV1WaV1,
} from '..';

import { constructOneForConfidenceCheck } from './construct-one-for-confidence-check';
import { constructOne } from './construct-one';
import { sendOneForConfidenceCheck } from './send-one-for-confidence-check';
import { sendOne } from './send-one';

export const _request = (
  adapter: AiServiceAdapterV1WaV1,
) => {
  const RET_VAL = {
    constructOneForConfidenceCheck: async (
      context: ISoeContextV1,
      params: IConstructRequestForConfidenceCheckParamsV1,
    ): Promise<IAiServiceRequestV1> => {
      const RET_VAL = await constructOneForConfidenceCheck(context, params);
      return RET_VAL;
    },
    constructOne: async (
      context: ISoeContextV1,
      params: IConstructRequestParamsV1,
    ): Promise<IAiServiceRequestV1> => {
      const RET_VAL = await constructOne(context, params);
      return RET_VAL;
    },
    sendOneForConfidenceCheck: async (
      context: ISoeContextV1,
      params: ISendRequestForConfidenceCheckParamsV1,
    ): Promise<IAiServiceResponseV1> => {
      const RET_VAL = await sendOneForConfidenceCheck(context, params);
      return RET_VAL;
    },
    sendOne: async (
      context: ISoeContextV1,
      params: ISendRequestParamsV1,
    ): Promise<IAiServiceResponseV1> => {
      const RET_VAL = await sendOne(context, params);
      return RET_VAL;
    },
  };
  return RET_VAL;
}
