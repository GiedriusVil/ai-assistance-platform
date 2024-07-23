/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
  validationEngagements: 'validationEngagements',
  validationEngagementsChanges: 'validationEngagementsChanges',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
  const COLLECTIONS_CONFIGURATION = configuration?.collections;

  const VALIDATION_ENGAGEMENTS = COLLECTIONS_CONFIGURATION?.validationEngagements;
  const VALIDATION_ENGAGEMENTS_CHANGES = COLLECTIONS_CONFIGURATION?.validationEngagementsChanges;

  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  if (
    !lodash.isEmpty(VALIDATION_ENGAGEMENTS)
  ) {
    RET_VAL.validationEngagements = VALIDATION_ENGAGEMENTS;
  }

  if (
    !lodash.isEmpty(VALIDATION_ENGAGEMENTS_CHANGES)
  ) {
    RET_VAL.validationEngagementsChanges = VALIDATION_ENGAGEMENTS_CHANGES;
  }
  return RET_VAL;
}


module.exports = {
  sanitizedCollectionsFromConfiguration,
}
