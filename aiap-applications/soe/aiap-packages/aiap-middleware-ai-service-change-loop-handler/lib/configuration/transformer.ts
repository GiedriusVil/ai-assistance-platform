/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const LIMIT_AS_STRING = rawConfiguration.MIDDLEWARE_AI_SERVICE_CHANGE_LOOP_HANDLER_LIMIT;
  const RET_VAL = provider.isEnabled('MIDDLEWARE_AI_SERVICE_CHANGE_LOOP_ENABLED', false, {
    limit: parseInt(LIMIT_AS_STRING),
    message: rawConfiguration.MIDDLEWARE_AI_SERVICE_CHANGE_LOOP_HANDLER_MESSAGE,
  });
  return RET_VAL;
}

