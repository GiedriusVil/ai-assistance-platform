/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-jobs-queues-runtime-storage-get-storage`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('ramda');

const STORAGE = {};

const getStorage = () => {
    return STORAGE;
}

const ensureQueuesStorage = (tenantId) => {
    let storage = ramda.path([tenantId], STORAGE);
    if (
        storage === undefined || storage === null
    ) {
        STORAGE[tenantId] = {};
    }
}


module.exports = {
    getStorage,
    ensureQueuesStorage
}
