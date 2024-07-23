/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const datasource = (flatClient) => {
    const RET_VAL = {
        name: ramda.path(['name'], flatClient),
        type: ramda.path(['type'], flatClient), 
        client: ramda.path(['client'], flatClient),
        collections: {
            rules: ramda.path(['collectionRules'], flatClient),
            rulesReleases: ramda.path(['collectionRulesReleases'], flatClient),
            rulesMessages: ramda.path(['collectionRulesMessages'], flatClient),
            messagesReleases: ramda.path(['collectionMessagesReleases'], flatClient),
        },
        defaultRulesEnabled: ramda.path(['defaultRulesEnabled'], flatClient),
        defaultMessagesEnabled: ramda.path(['defaultMessagesEnabled'], flatClient)
    }
    return RET_VAL;
}

const datasources = (flatSources) => {
    const RET_VAL = [];
    if (!lodash.isEmpty(flatSources)) {
        for(let flatSource of flatSources){
            if (!lodash.isEmpty(flatSource)) {
                RET_VAL.push(datasource(flatSource));
            }
        }
    }
    return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const CLIENTS_FLAT = provider.getKeys(
        'RULES_DATASOURCE_PROVIDER', 
        [
            'NAME', 
            'TYPE', 
            'CLIENT', 
            'COLLECTION_RULES',
            'COLLECTION_RULES_RELEASES',
            'COLLECTION_RULES_MESSAGES',
            'COLLECTION_MESSAGES_RELEASES',
            'DEFAULT_RULES_ENABLED',
            'DEFAULT_RULES_MESSAGES_ENABLED'
        ]
    );
    const DATASOURCES = datasources(CLIENTS_FLAT);
    const RULES_IMPORT_PREFIX = rawConfiguration['RULES_IMPORT_COLLECTION_PREFIX'];
    const RULES_MESSAGES_IMPORT_PREFIX = rawConfiguration['RULES_MESSAGES_IMPORT_COLLECTION_PREFIX'];

    const RET_VAL = provider.isEnabled('RULES_DATASOURCE_PROVIDER_ENABLED', false, {
        sources: DATASOURCES,
        rulesImportCollectionPrefix: RULES_IMPORT_PREFIX,
        rulesMessagesImportCollectionPrefix: RULES_MESSAGES_IMPORT_PREFIX,
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
