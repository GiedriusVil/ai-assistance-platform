/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter-watson-language-translator-v3';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { AiTranslationServiceAdapterV1 } from '../adapter';

import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import {
  ICreateOneParamsV1,
  IDeleteManyParamsV1,
  IDeleteOneParamsV1,
  IGetManyParamsV1,
  IGetOneParamsV1,
  ITranslateTextParamsV1,
  IGetIdentifiableLanguagesParamsV1,
  IIdentifyLanguageByTextParamsV1,
} from './types/params';

import { _models } from './models';
import { _translation } from './translation';
import { _identification } from './identification';

class AiTranslationServiceAdapterWatsonLanguageTranslatorV3 extends AiTranslationServiceAdapterV1 {

  constructor() {
    super();
  }

  get models() {
    const RET_VAL = {
      createOne: async (
        context: IContextV1,
        params: ICreateOneParamsV1,
      ) => {
        return _models.createOne(context, params);
      },
      updateOne: async (
        context: IContextV1,
        params: any
      ) => {

      },
      deleteOne: async (
        context: IContextV1,
        params: IDeleteOneParamsV1
      ) => {
        return _models.deleteOne(context, params);
      },
      deleteMany: async (
        context: IContextV1,
        params: IDeleteManyParamsV1
      ) => {
        return _models.deleteMany(context, params);
      },
      getOne: async (
        context: IContextV1,
        params: IGetOneParamsV1
      ) => {
        return _models.getOne(context, params);
      },
      getMany: async (
        context: IContextV1,
        params: IGetManyParamsV1
      ) => {
        return _models.getMany(context, params);
      }
    };
    return RET_VAL;
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

  get identification() {
    const RET_VAL = {
      identifyLanguageByText: async (
        context: IContextV1,
        params: IIdentifyLanguageByTextParamsV1
      ) => {
        return _identification.identifyLanguageByText(context, params);
      },
      getIdentifiableLanguages: (
        context: IContextV1,
        params: IGetIdentifiableLanguagesParamsV1
      ) => {
        return _identification.getIdentifiableLanguages(context, params);
      },
    };
    return RET_VAL;
  }
}

export {
  AiTranslationServiceAdapterWatsonLanguageTranslatorV3,
};
