/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
  oauth2TokensRefresh: 'oauth2_tokens_refresh',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
  const COLLECTIONS_CONFIGURATION = configuration?.collections;
  const OAUTH2_TOKENS_REFRESH = COLLECTIONS_CONFIGURATION?.oauth2TokensRefresh;
  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  if (
    !lodash.isEmpty(OAUTH2_TOKENS_REFRESH)
  ) {
    RET_VAL.oauth2TokensRefresh = OAUTH2_TOKENS_REFRESH;
  }
  return RET_VAL;
}

module.exports = {
  sanitizedCollectionsFromConfiguration,
}
