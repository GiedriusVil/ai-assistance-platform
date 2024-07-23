/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const isTrue = (value) => {
    let retVal = false;
    if (
      lodash.isString(value) && 
      value === 'true'
    ) {
      retVal = true;
    } else if (
      lodash.isBoolean(value) &&
      value
    ) {
      retVal = true;
    }
    return retVal;
};

const datasource = (flatClient) => {
    const RET_VAL = {
        name: ramda.path(['name'], flatClient),
        type: ramda.path(['type'], flatClient), 
        client: ramda.path(['client'], flatClient),
        collections: {
            buyRules: ramda.path(['collectionBuyRules'], flatClient),
            buyRulesReleases: ramda.path(['collectionBuyRulesRelease'], flatClient),
        },
    }
    const DEFAULT_BUY_RULES_ENABLED = ramda.path(['defaultBuyRulesEnabled'], flatClient) || 'false';
    RET_VAL.defaultBuyRulesEnabled = isTrue(DEFAULT_BUY_RULES_ENABLED);

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
        'BUY_RULES_DATASOURCE_PROVIDER', 
        [
            'NAME', 
            'TYPE', 
            'CLIENT', 
            'COLLECTION_BUY_RULES', 
            'COLLECTION_BUY_RULES_RELEASES',
            'DEFAULT_BUY_RULES_ENABLED'
        ]
    );
    const DATASOURCES = datasources(CLIENTS_FLAT);
    const RET_VAL = provider.isEnabled('BUY_RULES_DATASOURCE_PROVIDER_ENABLED', false, {
        sources: DATASOURCES
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
