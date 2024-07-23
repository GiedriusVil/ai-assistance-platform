/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AI_TRANSLATION_MODEL_TYPE_ENUM,
} from './ai-translation-model-type-enum'

import {
  IAiTranslationModelExternalWLTV1
} from './ai-translation-model-external';

import {
  IAiTranslationModelExampleV1
} from '../ai-translation-model-example';


export interface IAiTranslationModelV1 {
  id?: string,
  name?: string,
  type?: AI_TRANSLATION_MODEL_TYPE_ENUM,
  created?: any,
  updated?: any,
  serviceId?: string,
  source?: string,
  status?: string,
  target?: string,
  examples?: Array<IAiTranslationModelExampleV1>,
  external?: {
    latest?: IAiTranslationModelExternalWLTV1,
  },
}
