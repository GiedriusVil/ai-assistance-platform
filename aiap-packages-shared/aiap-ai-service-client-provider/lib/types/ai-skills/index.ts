/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiServiceV1,
  IAiSkillV1,
} from '@ibm-aiap/aiap--types-server';

export interface ISaveAiSkillParamsV1 {
  value: IAiSkillV1,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISaveAiSkillResponseV1 {

}

export interface ICheckAiSkillByIdForStatusAvailableParamsV1 {
  id: string,
}

export interface ICheckAiSkillByIdForStatusAvailableResponseV1 {
  value: boolean,
}

export interface ICheckAiSkillsByIdsForStatusAvailableParamsV1 {
  ids: Array<string>,
}

export interface ICheckAiSkillsByIdsForStatusAvailableResponseV1 {
  value: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICountAiSkillsByQueryParamsV1 {

}

export interface ICountAiSkillsByQueryResponseV1 {
  count: number,
}

export interface IDeleteAiSkillByIdParamsV1 {
  id: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDeleteAiSkillByIdResponseV1 {

}

export interface IDeleteAiSkillsByIdsParamsV1 {
  ids: Array<string>,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDeleteAiSkillsByIdsResponseV1 {

}

export interface IRetrieveAiSkillsByQueryParamsV1 {
  aiService: IAiServiceV1,
}

export interface IRetrieveAiSkillsByQueryResponseV1 {
  items: Array<IAiSkillV1>,
}

export interface IRetrieveAiSkillByIdParamsV1 {
  aiService: IAiServiceV1,
  id: string,
}

export interface IRetrieveAiSkillByIdResponseV1 {
  value: IAiSkillV1,
}

export interface ISynchroniseAiSkillParamsV1 {
  aiSkill: IAiSkillV1,
  options?: {
    syncIntents?: boolean,
    syncEntities?: boolean,
    syncDialogNodes?: boolean,
  },
}
