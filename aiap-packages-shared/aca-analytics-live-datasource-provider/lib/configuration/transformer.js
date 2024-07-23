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
            conversations: ramda.path(['collectionConversations'], flatClient),
            dashboardsConfigurations: ramda.path(['collectionDashboardsConfigurations'], flatClient),
            utterances: ramda.path(['collectionUtterances'], flatClient),
            messages: ramda.path(['collectionMessages'], flatClient),
            entities: ramda.path(['collectionEntities'], flatClient),
            intents: ramda.path(['collectionIntents'], flatClient),
            feedbacks: ramda.path(['collectionFeedbacks'], flatClient),
            surveys: ramda.path(['collectionSurveys'], flatClient),
            tones: ramda.path(['collectionTones'], flatClient),
            environments: ramda.path(['collectionEnvironments'], flatClient),
            users: ramda.path(['collectionUsers'], flatClient),
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
        'ANALYTICS_LIVE_DATASOURCE_PROVIDER',
        [
            'NAME',
            'TYPE',
            'CLIENT',
            'COLLECTION_CONVERSATIONS',
            'COLLECTION_DASHBOARDS_CONFIGURATIONS',
            'COLLECTION_MESSAGES',
            'COLLECTION_UTTERANCES',
            'COLLECTION_ENTITIES',
            'COLLECTION_INTENTS',
            'COLLECTION_FEEDBACKS',
            'COLLECTION_SURVEYS',
            'COLLECTION_TONES',
            'COLLECTION_ENVIRONMENTS',
            'COLLECTION_USERS',
        ]
    );
    const DATASOURCES = datasources(CLIENTS_FLAT);
    const RET_VAL = provider.isEnabled('ANALYTICS_LIVE_DATASOURCE_PROVIDER_ENABLED', false, {
        sources: DATASOURCES
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
