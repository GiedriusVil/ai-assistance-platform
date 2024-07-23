/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
    answers: 'answers',
    answersReleases: 'answersReleases',
    answerStores: 'answerStores',
    answerStoreReleases: 'answerStoreReleases',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
    const COLLECTIONS_CONFIGURATION = ramda.path(['collections'], configuration);

    const ANSWERS = ramda.path(['answers'], COLLECTIONS_CONFIGURATION);
    const ANSWERS_RELEASES = ramda.path(['answersReleases'], COLLECTIONS_CONFIGURATION);
    const ANSWER_STORES = ramda.path(['answerStores'], COLLECTIONS_CONFIGURATION);
    const ANSWER_STORE_RELEASES = ramda.path(['answerStoreReleases'], COLLECTIONS_CONFIGURATION);

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
        !lodash.isEmpty(ANSWERS)
    ) {
        RET_VAL.answers = ANSWERS;
    }
    if (
        !lodash.isEmpty(ANSWERS_RELEASES)
    ) {
        RET_VAL.answersReleases = ANSWERS_RELEASES;
    }
    if (
        !lodash.isEmpty(ANSWER_STORES)
    ) {
        RET_VAL.answerStores = ANSWER_STORES;
    }
    if (
        !lodash.isEmpty(ANSWER_STORE_RELEASES)
    ) {
        RET_VAL.answerStoreReleases = ANSWER_STORE_RELEASES;
    }
    return RET_VAL;
}


module.exports = {
    sanitizedCollectionsFromConfiguration,
}
