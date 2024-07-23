/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AiTranslationServiceAdapterWatsonLanguageTranslatorV3
} from '../adapter-watson-language-translator-v3';
import {
  AiTranslationServiceAdapterWatsonxV1
} from '../adapter-watsonx-v1';

export interface IAiTranslationServiceAdapterV1 {
  [key: string]: AiTranslationServiceAdapterWatsonLanguageTranslatorV3 | AiTranslationServiceAdapterWatsonxV1
}
