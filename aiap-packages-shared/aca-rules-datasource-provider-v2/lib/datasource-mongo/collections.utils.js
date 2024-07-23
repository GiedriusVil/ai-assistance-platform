/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-datasource-provider-v2-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
  rulesV2: 'rulesV2',
  rulesConditionsV2: 'rulesConditionsV2',
  rulesChangesV2: 'rulesChangesV2',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
  const COLLECTIONS_CONFIGURATION = configuration?.collections;

  const RULES_V2 = COLLECTIONS_CONFIGURATION?.rulesV2;
  const RULES_CONDITIONS_V2 = COLLECTIONS_CONFIGURATION?.rulesConditionsV2;
  const RULES_CHANGES_V2 =COLLECTIONS_CONFIGURATION?.rulesChangesV2;

  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  if (
    !lodash.isEmpty(RULES_V2)
  ) {
    RET_VAL.rulesV2 = RULES_V2;
  }
  if (
    !lodash.isEmpty(RULES_CONDITIONS_V2)
  ) {
    RET_VAL.rulesConditionsV2 = RULES_CONDITIONS_V2;
  }
  if (
    !lodash.isEmpty(RULES_CHANGES_V2)
  ) {
    RET_VAL.rulesChangesV2 = RULES_CHANGES_V2;
  }
  return RET_VAL;
}


module.exports = {
  sanitizedCollectionsFromConfiguration,
}
