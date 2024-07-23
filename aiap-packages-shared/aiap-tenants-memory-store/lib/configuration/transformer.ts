/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = provider.isEnabled('TENANTS_MEMORY_STORE_ENABLED', false, {});
  return RET_VAL;
}

