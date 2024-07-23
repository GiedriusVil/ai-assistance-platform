/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISendMessageParamsV1,
  ISendMessageResponseV1,
} from '../../types';

import {
  AiServiceClientV1ChatGptV3,
} from '..';

import { sendOne } from './send-one';

export const _messages = (
  client: AiServiceClientV1ChatGptV3,
) => {
  const RET_VAL = {
    sendOneForTest: async (
      context: IContextV1,
      params: ISendMessageParamsV1,
    ): Promise<ISendMessageResponseV1> => {
      const RET_VAL = null;
      return RET_VAL;
    },
    sendOne: async (
      context: IContextV1,
      params: ISendMessageParamsV1
    ): Promise<ISendMessageResponseV1> => {
      const RET_VAL = await sendOne(client, context, params);
      return RET_VAL;
    }
  };
  return RET_VAL;
}
