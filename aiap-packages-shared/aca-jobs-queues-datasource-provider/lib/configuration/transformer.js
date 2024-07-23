/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const datasource = (flatClient) => {

    const DATASOURCE_NAME = ramda.path(['name'], flatClient);
    const DATASOURCE_TYPE = ramda.path(['type'], flatClient);
    const DATASOURCE_CLIENT = ramda.path(['client'], flatClient)

    const JOBS_QUEUES = ramda.path(['jobsQueues'], flatClient);

    const RET_VAL = {
        name: DATASOURCE_NAME,
        type: DATASOURCE_TYPE,
        client: DATASOURCE_CLIENT,
        collections: {
            jobsQueues: JOBS_QUEUES,
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
        'JOBS_QUEUES_DATASOURCE_PROVIDER',
        [
            'NAME',
            'TYPE',
            'CLIENT',
            'COLLECTION_JOBS_QUEUES',
        ]
    );
    const DATASOURCES = datasources(CLIENTS_FLAT);
    const RET_VAL = provider.isEnabled('JOBS_QUEUES_DATASOURCE_PROVIDER_ENABLED', false, {
        sources: DATASOURCES
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
