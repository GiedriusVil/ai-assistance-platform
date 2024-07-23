/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ISoeContextV1,
  ISoeUpdateSessionStateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IFormatResponseParamsV1,
  IFormatResponseResponseV1,
  IRetrieveConfidenceParamsV1,
  IRetrieveConfidenceResponseV1,
  IRetrieveContextParamsV1,
  IRetrieveContextResponseV1,
  IRetrieveIntentsParamsV1,
  IRetrieveIntentsResponseV1,
  IRetrieveStateParamsV1,
} from '../../../types';

import {
  AiServiceAdapterV1WaV1,
} from '..';

import { formatOne } from './format-one';
import { retrieveConfidence } from './retrieve-confidence';
import { retrieveContext } from './retrieve-context';
import { retrieveIntents } from './retrieve-intents';
import { retrieveState } from './retrieve-state';

export const _response = (
  adapter: AiServiceAdapterV1WaV1,
) => {
  const RET_VAL = {
    formatOne: async (
      context: ISoeContextV1,
      params: IFormatResponseParamsV1,
    ): Promise<IFormatResponseResponseV1> => {
      const _RET_VAL = await formatOne(context, params);
      return _RET_VAL;
    },
    retrieveConfidence: async (
      context: ISoeContextV1,
      params: IRetrieveConfidenceParamsV1,
    ): Promise<IRetrieveConfidenceResponseV1> => {
      const RET_VAL = await retrieveConfidence(context, params);
      return RET_VAL;
    },
    retrieveContext: async (
      context: ISoeContextV1,
      params: IRetrieveContextParamsV1,
    ): Promise<IRetrieveContextResponseV1> => {
      const RET_VAL = await retrieveContext(context, params);
      return RET_VAL;
    },
    retrieveIntents: async (
      context: ISoeContextV1,
      params: IRetrieveIntentsParamsV1,
    ): Promise<IRetrieveIntentsResponseV1> => {
      const RET_VAL = await retrieveIntents(context, params);
      return RET_VAL;
    },
    retrieveState: async (
      context: ISoeContextV1,
      params: IRetrieveStateParamsV1,
    ): Promise<ISoeUpdateSessionStateV1> => {
      const RET_VAL = await retrieveState(context, params);
      return RET_VAL;
    },
  };
  return RET_VAL;
}
