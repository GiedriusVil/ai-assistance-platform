/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = provider.isEnabled('MIDDLEWARE_USER_MESSAGE_TEXT_REPLACER', false, {});
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
