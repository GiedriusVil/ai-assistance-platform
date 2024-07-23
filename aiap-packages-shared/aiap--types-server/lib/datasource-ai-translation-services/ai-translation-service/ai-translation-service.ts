/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AI_TRANSLATION_SERVICE_TYPE_ENUM
} from './ai-translation-service-type-enum';

import {
  IAiTranslationServiceExternalWLTV1,
  IAiTranslationServiceExternalWatsonxV1,
} from './ai-translation-service-external';

import {
  IAiTranslationModelV1
} from '../ai-translation-model';


export interface IAiTranslationServiceV1 {
  id?: string,
  name?: string,
  type?: AI_TRANSLATION_SERVICE_TYPE_ENUM,
  created?: {
    user?: {
      id: string,
      name: string
    },
    date?: Date,
  },
  updated?: {
    user?: {
      id: string,
      name: string
    },
    date?: Date,
  },
  models?: Array<IAiTranslationModelV1>,
  external?: IAiTranslationServiceExternalWLTV1 | IAiTranslationServiceExternalWatsonxV1,
}
