/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiTranslationServiceV1,
  IAiTranslationPromptV1,
  ILLMParams,
} from '@ibm-aiap/aiap--types-server';

export interface ITranslateTextParamsV1 {
  aiTranslationService?: IAiTranslationServiceV1,
  aiTranslationPrompt?: IAiTranslationPromptV1,
  parameters?: ILLMParams,
  input?: string,
}
