/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-datasource-mongo-ai-utils';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  getEncrypter
} from '@ibm-aiap/aiap-utils-encrypter';

import {
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationServiceV1
} from "@ibm-aiap/aiap--types-server"

const encryptAiTranslationServicePassword = (
  secret: string,
  aiTranslationService: IAiTranslationServiceV1
): void => {
  if (
    lodash.isEmpty(secret)
  ) {
    const MESSAGE = `Missing required secret parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  if (
    lodash.isEmpty(aiTranslationService)
  ) {
    const MESSAGE = `Missing required aiTranslationService parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const SERVICE_PASSWORD = aiTranslationService?.external?.password;
  if (
    lodash.isEmpty(SERVICE_PASSWORD)
  ) {
    delete aiTranslationService.external.password;
  } else {
    const ENCRYPTOR = getEncrypter(secret);
    aiTranslationService.external.password = ENCRYPTOR.encrypt(SERVICE_PASSWORD);
  }
}

const decryptAiTranslationServicePassword = (
  secret: string,
  aiTranslationService: IAiTranslationServiceV1
): void => {
  if (
    lodash.isEmpty(secret)
  ) {
    const MESSAGE = `Missing required secret parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  if (
    lodash.isEmpty(aiTranslationService)
  ) {
    const MESSAGE = `Missing required aiTranslationService parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const SERVICE_PASSWORD = aiTranslationService?.external?.password;
  if (
    !lodash.isEmpty(SERVICE_PASSWORD)
  ) {
    const ENCRYPTOR = getEncrypter(secret);
    aiTranslationService.external.password = JSON.parse(ENCRYPTOR.decrypt(SERVICE_PASSWORD));
  }
}

export {
  encryptAiTranslationServicePassword,
  decryptAiTranslationServicePassword,
}
