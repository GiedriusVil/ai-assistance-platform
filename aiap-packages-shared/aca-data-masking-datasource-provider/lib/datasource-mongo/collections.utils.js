/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-data-masking-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
  dataMaskingConfigurations: 'dataMaskingConfigurations'
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
  const COLLECTIONS_CONFIGURATION = ramda.path(['collections'], configuration);

  const DATA_MASKING_CONFIGURATIONS = ramda.path(['dataMaskingConfigurations'], COLLECTIONS_CONFIGURATION);

  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  if (
    !lodash.isEmpty(DATA_MASKING_CONFIGURATIONS)
  ) {
    RET_VAL.dataMaskingConfigurations = DATA_MASKING_CONFIGURATIONS;
  }
  return RET_VAL;
}


module.exports = {
  sanitizedCollectionsFromConfiguration,
}
