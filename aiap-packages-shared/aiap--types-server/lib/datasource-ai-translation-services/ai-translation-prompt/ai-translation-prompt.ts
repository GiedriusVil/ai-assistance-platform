/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiTranslationPromptExternalWatsonxV1
} from './ai-translation-prompt-external';

export interface IAiTranslationPromptV1 {
  id?: string,
  name?: string,
  type?: string,
  deploymentName?: string,
  created?: any,
  updated?: any,
  serviceId?: string,
  source?: string,
  target?: string,
  external?: IAiTranslationPromptExternalWatsonxV1,
}
