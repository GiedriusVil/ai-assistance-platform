/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const datasource = (flatClient) => {
    const RET_VAL = {
        name: ramda.path(['name'], flatClient),
        type: ramda.path(['type'], flatClient),
        client: ramda.path(['client'], flatClient),
        collections: {
            answers: ramda.path(['collectionAnswers'], flatClient),
            answersReleases: ramda.path(['collectionAnswersReleases'], flatClient),
            answerStores: ramda.path(['collectionAnswerStores'], flatClient),
            answerStoreReleases: ramda.path(['collectionAnswerStoreReleases'], flatClient),
        }
    }
    return RET_VAL;
}

const datasources = (flatSources) => {
    const RET_VAL = [];
    if (!ramda.isNil(flatSources)) {
        for (let flatSource of flatSources) {
            if (!ramda.isNil(flatSource)) {
                RET_VAL.push(datasource(flatSource));
            }
        }
    }
    return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const CLIENTS_FLAT = provider.getKeys(
        'ANSWERS_DATASOURCE_PROVIDER',
        [
            'NAME',
            'TYPE',
            'CLIENT',
            'COLLECTION_ANSWERS',
            'COLLECTION_ANSWERS_RELEASES',
            'COLLECTION_ANSWER_STORES',
            'COLLECTION_ANSWER_STORE_RELEASES'
        ]
    );
    const DATASOURCES = datasources(CLIENTS_FLAT);
    const RET_VAL = provider.isEnabled('ANSWERS_DATASOURCE_PROVIDER_ENABLED', false, {
        sources: DATASOURCES
    });


    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
