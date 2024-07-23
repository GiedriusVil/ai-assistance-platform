/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const DEFAULT_SECRET = 'some_very_strong_secret';
const DEFAULT_EXPIRATION = 86400;

export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = {
    secret: rawConfiguration.AIAP_JWT_PROVIDER_SECRET || DEFAULT_SECRET,
    expiration: rawConfiguration.AIAP_JWT_PROVIDER_EXPIRATION || DEFAULT_EXPIRATION,
  };
  return RET_VAL;
}
