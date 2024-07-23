/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

export class UIMissingTranslationHandler implements MissingTranslationHandler {

  handle(params: MissingTranslationHandlerParams) {
    return `[AIAP] Translation for '${params?.key}' is missing!`;
  }

}
