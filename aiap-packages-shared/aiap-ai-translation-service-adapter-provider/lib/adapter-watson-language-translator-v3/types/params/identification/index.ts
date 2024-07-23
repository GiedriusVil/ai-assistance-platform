/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiTranslationServiceV1,
} from '@ibm-aiap/aiap--types-server';

export interface IIdentifyLanguageByTextParamsV1 {
  aiTranslationService: IAiTranslationServiceV1,
  text: string,
}
