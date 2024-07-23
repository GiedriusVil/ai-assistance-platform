/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('ROCKETCHAT_CHANNEL_PROVIDER_ENABLED', false);
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
