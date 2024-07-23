/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

/** Not allows blank rows */
export const clearInput = formField => {
  const text = formField.value.trim().replace(/\n/g, '');
  if (!text) {
    formField.patchValue('');
  }
};

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return `Translation for '${params?.key}' is missing!`;
  }
}
