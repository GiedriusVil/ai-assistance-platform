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
            organizations: ramda.path(['collectionOrganizations'], flatClient),
            organizationsReleases: ramda.path(['collectionOrganizationsReleases'], flatClient), 
        },
    }
    const DEFAULT_ORGANIZATIONS_ENABLED = ramda.path(['defaultOrganizationsEnabled'], flatClient) || 'false';
    RET_VAL.defaultOrganizationsEnabled = isTrue(DEFAULT_ORGANIZATIONS_ENABLED);

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
        'ORGANIZATIONS_DATASOURCE_PROVIDER', 
        [
            'NAME', 
            'TYPE', 
            'CLIENT', 
            'COLLECTION_ORGANIZATIONS', 
            'COLLECTION_ORGANIZATIONS_RELEASES',
            'DEFAULT_ORGANIZATIONS_ENABLED'
        ]
    );
    const DATASOURCES = datasources(CLIENTS_FLAT);
    const ORGANIZATIONS_IMPORT_COLLECTION_PREFIX = rawConfiguration['ORGANIZATIONS_IMPORT_COLLECTION_PREFIX'];

    const RET_VAL = provider.isEnabled('ORGANIZATIONS_DATASOURCE_PROVIDER_ENABLED', false, {
        sources: DATASOURCES,
        organizationsImportCollectionPrefix: ORGANIZATIONS_IMPORT_COLLECTION_PREFIX,
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
