/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('ramda');
const lodash = require('lodash');

const transformDatasourceForLogger = (datasource) => {
    let retVal;
    if (
        !lodash.isEmpty(datasource)
    ) {
        const ID = ramda.path(['id'], datasource);
        const HASH = ramda.path(['hash'], datasource);
        const TYPE = ramda.path(['type'], datasource);
        const CLIENT = ramda.path(['client'], datasource);
        const CLIENT_HASH = ramda.path(['clientHash'], datasource);
        retVal = {
            id: ID, 
            hash: HASH, 
            type: TYPE, 
            client: CLIENT, 
            clientHash: CLIENT_HASH,
        };
    }
    return retVal;
}

const transformDatasourcesForLogger = (datasources) => {
    let retVal;
    if (
        lodash.isArray(datasources) 
    ) {
        retVal = datasources.map((item)=> {
            return transformDatasourceForLogger(item);
        });
    }
    return retVal;
}

module.exports = {
    transformDatasourcesForLogger,
}
