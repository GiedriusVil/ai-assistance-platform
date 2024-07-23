/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transform = (rawConfiguration, provider) => {
  const RET_VAL = {};
  const DEFAULT_PATTERNS = provider.getKeys(
    'DATA_MASKING_DEFAULT_PATTERNS',
    ['KEY', 'PATTERN', 'REPLACE_TYPE', 'PATTERN_TYPE']
  );

  const DISABLED_MASKING = rawConfiguration.DATA_MASKING_DISABLED_BY_TENANT;

  RET_VAL.defaultPatterns = DEFAULT_PATTERNS;
  RET_VAL.disabledMaskingByTenant = DISABLED_MASKING;
  return RET_VAL;
}

const transformRawConfiguration = (rawConfiguration, provider) => {
  const IS_ENABLED = provider.isEnabled('DEFAULT_DATA_MASKING_ENABLED', false);

  if (IS_ENABLED) {
    return transform(rawConfiguration, provider);
  }
  return IS_ENABLED;
}

module.exports = {
  transformRawConfiguration,
}
