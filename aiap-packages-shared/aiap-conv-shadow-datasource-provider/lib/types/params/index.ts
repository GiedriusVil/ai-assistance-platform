/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IConversationShadowV1,
  IUtteranceShadowV1,
  IMessageShadowV1,
} from '../data-entities';

export interface IConversationShadowSaveOneParamsV1 {
  value: IConversationShadowV1,
  options?: any,
}

export interface IUtteranceShadowSaveOneParamsV1 {
  value: IUtteranceShadowV1
  options?: any,
}

export interface IMessageShadowSaveOneParamsV1 {
  value: IMessageShadowV1,
  options?: any,
}


