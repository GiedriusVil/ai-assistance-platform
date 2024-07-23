/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const secretProviders = require('@aiap/aiap-secrets-providers').init;

import {
  isEnabled,
} from '@ibm-aiap/aiap-env-configuration-service';

const getSecretProvider = async (rawConfig) => {
  const CONFIG = {
    keyProtect: isEnabled('IBM_KEY_PROTECT_ENABLED', false, {
      iamAPIKey: rawConfig.KEY_PROTECT_IAM_API_KEY,
      iamAPITokenURL: rawConfig.KEY_PROTECT_IAM_API_TOKEN_URL,
      passphrase: rawConfig.KEY_PROTECT_PASSPHRASE,
      keyProtectInstanceID: rawConfig.KEY_PROTECT_INSTANCE,
      keyProtectURL: rawConfig.KEY_PROTECT_URL,
      keyID: rawConfig.KEY_PROTECT_KEY_ID,
      salt1: rawConfig.KEY_PROTECT_SALT1, //optional
      salt2: rawConfig.KEY_PROTECT_SALT2, //optional
    }),
  };
  const secretProvider = secretProviders(CONFIG);
  await secretProvider.init();
  return secretProvider;
}

const isStringTrue = myValue => (myValue === 'true');

export {
  isStringTrue,
  getSecretProvider
}
