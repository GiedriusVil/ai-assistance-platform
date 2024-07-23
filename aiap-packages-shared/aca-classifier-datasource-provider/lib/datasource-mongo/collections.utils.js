/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
    models: 'models',
    modelsChanges: 'modelsChanges',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
    const COLLECTIONS_CONFIGURATION = configuration?.collections;

    const MODELS = COLLECTIONS_CONFIGURATION?.models;
    const MODELS_CHANGES = COLLECTIONS_CONFIGURATION?.modelsChanges;

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
        !lodash.isEmpty(MODELS)
    ) {
        RET_VAL.models = MODELS;
    }
    if (
      !lodash.isEmpty(MODELS_CHANGES)
  ) {
      RET_VAL.modelsChanges = MODELS_CHANGES;
  }
    return RET_VAL;
}

module.exports = {
    sanitizedCollectionsFromConfiguration,
}
