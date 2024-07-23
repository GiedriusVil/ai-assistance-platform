/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AiTranslationServiceAdapterWatsonxV1,
} from './lib/adapter-watsonx-v1';
import {
  AiTranslationServiceAdapterWatsonLanguageTranslatorV3
} from './lib/adapter-watson-language-translator-v3';

import { AI_TRANSLATION_MODEL_STATUS } from './lib/utils';
import { IAiTranslationServiceAdapterV1 } from './lib/types';

const REGISTRY: IAiTranslationServiceAdapterV1 = {
  WATSONX: new AiTranslationServiceAdapterWatsonxV1(),
  WLT: new AiTranslationServiceAdapterWatsonLanguageTranslatorV3(),
};

const getRegistry = () => {
  return REGISTRY;
}

export {
  getRegistry,
  AI_TRANSLATION_MODEL_STATUS,
};
