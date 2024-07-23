/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const transformRawBasicAuthenicationWareUsersConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = provider.getKeys(
    'EXPRESS_MIDLEWARE_PROVIDER_AUTHENTICATION_WARE_USER',
    [
      'USERNAME',
      'PASSWORD',
    ]
  );
  return RET_VAL;
}


const transformRawBasicAuthenicationWareConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = provider.isEnabled('EXPRESS_MIDLEWARE_PROVIDER_AUTHENTICATION_WARE_ENABLED', false, {
    users: await transformRawBasicAuthenicationWareUsersConfiguration(rawConfiguration, provider),
  });
  return RET_VAL;
}

// eslint-disable-next-line no-unused-vars
const transformRawFormidableWareOptionsConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = {
    maxFileSize: rawConfiguration['EXPRESS_MIDLEWARE_PROVIDER_FORMIDABLE_WARE_OPTION_MAX_FILE_SIZE'],
  };
  return RET_VAL;
}

const transformRawFormidableWareConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = provider.isEnabled('EXPRESS_MIDLEWARE_PROVIDER_FORMIDABLE_WARE_ENABLED', false, {
    options: await transformRawFormidableWareOptionsConfiguration(rawConfiguration, provider),
  });
  return RET_VAL;
}

export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = provider.isEnabled('EXPRESS_MIDLEWARE_PROVIDER_ENABLED', false, {
    basicAuthenticationWare: await transformRawBasicAuthenicationWareConfiguration(rawConfiguration, provider),
    formidableWare: await transformRawFormidableWareConfiguration(rawConfiguration, provider),
  });
  return RET_VAL;
}
