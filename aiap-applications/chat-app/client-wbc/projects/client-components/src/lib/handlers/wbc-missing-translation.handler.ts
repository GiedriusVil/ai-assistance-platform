/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

export class WbcMissingTranslationHandler implements MissingTranslationHandler {

  handle(params: MissingTranslationHandlerParams) {
    const RET_VAL = `Translation for ${params?.key} is missing!`;
    return RET_VAL;
  }

}
