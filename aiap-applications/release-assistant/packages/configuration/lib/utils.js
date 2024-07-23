

const secretProviders = require('@aiap/aiap-secrets-providers').init;
const {
  isEnabled
} = require('@ibm-aiap/aiap-env-configuration-service');

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
  const SECRET_PROVIDER = secretProviders(CONFIG);
  await SECRET_PROVIDER.init();
  return SECRET_PROVIDER;
}

const isStringTrue = myValue => (myValue === 'true');

module.exports = {
  isStringTrue,
  getSecretProvider
}
