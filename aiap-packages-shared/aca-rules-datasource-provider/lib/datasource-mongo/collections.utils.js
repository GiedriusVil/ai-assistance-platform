/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-auditor-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
  rules: 'rules',
  rulesReleases: 'rules_releases',
  rulesMessages: 'rulesMessages',
  messsagesReleases: 'messages_releases'
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
  const COLLECTIONS_CONFIGURATION = configuration?.collections;
  const RULES = COLLECTIONS_CONFIGURATION?.rules;
  const RULES_RELEASES = COLLECTIONS_CONFIGURATION?.rulesReleases;
  const MESSAGES = COLLECTIONS_CONFIGURATION?.rulesMessages;
  const MESSAGES_RELEASES = COLLECTIONS_CONFIGURATION?.messagesReleases;

  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  if (
    !lodash.isEmpty(RULES)
  ) {
    RET_VAL.rules = RULES;
  }
  if (
    !lodash.isEmpty(RULES_RELEASES)
  ) {
    RET_VAL.rulesReleases = RULES_RELEASES;
  }
  if (
    !lodash.isEmpty(MESSAGES)
  ) {
    RET_VAL.rulesMessages = MESSAGES;
  }
  if (
    !lodash.isEmpty(MESSAGES_RELEASES)
  ) {
    RET_VAL.messsagesReleases = MESSAGES_RELEASES;
  }
  return RET_VAL;
}


module.exports = {
  sanitizedCollectionsFromConfiguration,
}
