/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('lodash');
const ramda = require('ramda');

const datasource = (flatClient) => {
    const RET_VAL = {
        name: ramda.path(['name'], flatClient),
        type: ramda.path(['type'], flatClient),
        client: ramda.path(['client'], flatClient),
        collections: {
            purchaseRequests: ramda.path(['collectionPurchaseRequests'], flatClient),
            rules: ramda.path(['collectionRules'], flatClient),
            rulesMessages: ramda.path(['collectionRulesMessages'], flatClient),
            lambdaModules: ramda.path(['collectionLambdaModules'], flatClient),
            lambdaModulesErrors: ramda.path(['collectionLambdaModulesErrors'], flatClient),
        },
    }
    return RET_VAL;
}

const datasources = (flatSources) => {
    const RET_VAL = [];
    if (!ramda.isNil(flatSources)) {
        for(let flatSource of flatSources){
            if (!ramda.isNil(flatSource)) {
                RET_VAL.push(datasource(flatSource));
            }
        }
    }
    return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const CLIENTS_FLAT = provider.getKeys(
        'AUDITOR_DATASOURCE_PROVIDER',
        [
            'NAME',
            'TYPE',
            'CLIENT',
            'COLLECTION_PURCHASE_REQUESTS',
            'COLLECTION_RULES',
            'COLLECTION_LAMBDA_MODULES',
            'COLLECTION_MESSAGES',
            'COLLECTION_LAMBDA_MODULES_ERRORS',
        ]
    );
    const DATASOURCES = datasources(CLIENTS_FLAT);
    const RET_VAL = provider.isEnabled('AUDITOR_DATASOURCE_PROVIDER_ENABLED', false, {
        sources: DATASOURCES
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
