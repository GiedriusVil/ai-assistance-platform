/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiTranslationServiceV1,
  IAiTranslationModelV1,
} from '@ibm-aiap/aiap--types-server';

export interface ITranslateTextParamsV1 {
  aiTranslationService?: IAiTranslationServiceV1,
  aiTranslationModel?: IAiTranslationModelV1,
  source?: string,
  target?: string,
  text?: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGetIdentifiableLanguagesParamsV1 {

}
