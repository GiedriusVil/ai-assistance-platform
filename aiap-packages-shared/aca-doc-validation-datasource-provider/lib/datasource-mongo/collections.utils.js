/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-doc-validation-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const DEFAULT_COLLECTIONS = {
  audits: 'docValidationAudits'
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
  try {
    const COLLECTIONS_CONFIGURATION = configuration?.collections;
    const AUDITS = COLLECTIONS_CONFIGURATION?.audits;

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
      !lodash.isEmpty(AUDITS)
    ) {
      RET_VAL.audits = AUDITS;
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${sanitizedCollectionsFromConfiguration.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  sanitizedCollectionsFromConfiguration,
}
