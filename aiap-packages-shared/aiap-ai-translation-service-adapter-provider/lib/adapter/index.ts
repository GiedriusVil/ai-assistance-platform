/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

abstract class AiTranslationServiceAdapterV1 {

  constructor() {
    //
  }

  get models() {
    const RET_VAL = {
      createOne: (context: any, params: any): any => {

      },
      updateOne: (context: any, params: any): any => {

      },
      deleteOne: (context: any, params: any): any => {

      },
      deleteMany: (context: any, params: any): any => {

      },
      getOne: (context: any, params: any): any => {

      },
      getMany: (context: any, params: any): any => {

      }
    };
    return RET_VAL;
  }

  get translation() {
    const RET_VAL = {
      translateText: (context: any, params: any): any => {

      }
    };
    return RET_VAL;
  }

  get identification() {
    const RET_VAL = {
      identifyLanguageByText: (context: any, params: any): any => {

      },
      getIdentifiableLanguages: (context: any, params: any): any => {

      }
    };
    return RET_VAL;
  }

}

export {
  AiTranslationServiceAdapterV1,
};
