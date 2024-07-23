/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-services-datasource-mongo-ai-utils';

const crypto = require('crypto');

import lodash from '@ibm-aca/aca-wrapper-lodash'
import ramda from '@ibm-aca/aca-wrapper-ramda'

import {
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

// const _collectionWaServices = (config) => {
//   return config.collection.waServices;
// }

// const _collectionWaSkills = (config) => {
//   return config.collection.waSkills;
// }
// TODO: use '@ibm-aca/aca-encrypter'

const algorithm = 'aes-192-cbc';
let passKey, key, iv;

function encrypt(data) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const getEncrypter = (
  encryptKey: any,
) => {
  passKey = encryptKey;
  key = crypto.scryptSync(passKey, 'salt', 24);
  iv = Buffer.alloc(16, 0); // Initialization vector.

  const RET_VAL = {
    encrypt,
    decrypt,
  };
  return RET_VAL;
}

export const encryptAiServicePassword = (
  secret: any,
  aiService: any,
) => {
  if (
    lodash.isEmpty(secret)
  ) {
    const MESSAGE = `Missing required secret parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  if (
    lodash.isEmpty(aiService)
  ) {
    const MESSAGE = `Missing required aiService parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const SERVICE_PASSWORD = ramda.path(['external', 'password'], aiService);
  if (
    lodash.isEmpty(SERVICE_PASSWORD)
  ) {
    delete aiService.external.password;
  } else {
    const ENCRYPTOR = getEncrypter(secret);
    aiService.external.password = ENCRYPTOR.encrypt(SERVICE_PASSWORD);
  }
}

export const decryptAiServicePassword = (
  secret: any,
  aiService: any,
) => {
  if (
    lodash.isEmpty(secret)
  ) {
    const MESSAGE = `Missing required secret parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  if (
    lodash.isEmpty(aiService)
  ) {
    const MESSAGE = `Missing required aiService parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const SERVICE_PASSWORD = ramda.path(['external', 'password'], aiService);
  if (
    !lodash.isEmpty(SERVICE_PASSWORD)
  ) {
    const ENCRYPTOR = getEncrypter(secret);
    aiService.external.password = JSON.parse(ENCRYPTOR.decrypt(SERVICE_PASSWORD));
  }
}
