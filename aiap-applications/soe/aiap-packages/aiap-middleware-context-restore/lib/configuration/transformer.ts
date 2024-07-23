/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const SUPPORTED_ACTIONS_RAW = rawConfiguration?.MIDDLEWARE_CONTEXT_RESTORE_SUPPORTED_ACTIONS;
  const CONFIGURATION = { supportedActions: [] };
  if (
    !lodash.isEmpty(SUPPORTED_ACTIONS_RAW) &&
    lodash.isString(SUPPORTED_ACTIONS_RAW)
  ) {
    CONFIGURATION.supportedActions = SUPPORTED_ACTIONS_RAW.split(',');
  }
  const RET_VAL = provider.isEnabled(
    'MIDDLEWARE_CONTEXT_RESTORE_ENABLED',
    false,
    CONFIGURATION,
  );
  return RET_VAL;
}

export {
  transformRawConfiguration
}
