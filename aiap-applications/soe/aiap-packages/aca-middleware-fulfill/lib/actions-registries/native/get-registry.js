/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-fulfill-actions-registry-get-registry';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const REGISTRY = {};

const getRegistry = () => {
    return REGISTRY;
}

module.exports = {
    getRegistry,
}
