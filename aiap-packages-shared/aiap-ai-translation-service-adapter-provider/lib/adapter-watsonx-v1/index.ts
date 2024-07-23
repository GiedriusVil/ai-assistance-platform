/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter-watsonx';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { AiTranslationServiceAdapterV1 } from '../adapter';

import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import {
  ITranslateTextParamsV1,
} from './types/params';

import { _translation } from './translation';

class AiTranslationServiceAdapterWatsonxV1 extends AiTranslationServiceAdapterV1 {

  constructor() {
    super();
  }

  get translation() {
    const RET_VAL = {
      translateText: async (
        context: IContextV1,
        params: ITranslateTextParamsV1
      ) => {
        return _translation.translateText(context, params);
      },
    };
    return RET_VAL;
  }
}

export {
  AiTranslationServiceAdapterWatsonxV1,
};
