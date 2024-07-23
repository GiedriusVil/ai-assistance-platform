/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-topic-modeling-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
    topicModels: 'topicModels',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
  const COLLECTIONS_CONFIGURATION = configuration?.collections;

    const TOPIC_MODELS = COLLECTIONS_CONFIGURATION?.topicModels;

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
        !lodash.isEmpty(TOPIC_MODELS)
    ) {
        RET_VAL.topicModels = TOPIC_MODELS;
    }
    return RET_VAL;
}

module.exports = {
    sanitizedCollectionsFromConfiguration,
}
