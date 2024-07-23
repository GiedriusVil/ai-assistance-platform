/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
  */

import {
  IAiTranslationPromptV1,
  ILLMParams,
} from '@ibm-aiap/aiap--types-server';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IListLanguagesParamsV1 {

}

export interface ITranslateTextParamsV1 {
  aiTranslationPrompt: IAiTranslationPromptV1,
  parameters: ILLMParams,
  input?: string,
}

export interface IWatsonxV1ConfigurationExternal {
  version: string,
  url: string,
  endpoint: string,
  authType: string,
  username: string,
  password: string,
  iamTokenUrl: string,
}

export interface IWatsonxV1 {
  config: IWatsonxV1ConfigurationExternal,
  version: string,
  url: string,
  endpoint: string,
  authType: string,
  username: string,
  password: string,
  headers: any,
  apiKey?: string,
  iamTokenUrl?: string,
}
