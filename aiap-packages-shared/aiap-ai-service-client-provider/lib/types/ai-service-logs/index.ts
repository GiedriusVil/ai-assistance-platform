/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiLogRecordV1,
  IAiSkillV1,
} from '@ibm-aiap/aiap--types-server';

export interface IRetrieveAiServiceLogsByQueryParamsV1 {
  query: {
    filter: {
      aiSkill: IAiSkillV1,
    },
  }
}

export interface IRetrieveAiServiceLogsByQueryResponseV1 {
  items: Array<IAiLogRecordV1>,
}
