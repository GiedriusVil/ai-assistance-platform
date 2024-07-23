/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-runtime-storage-delete-one-by-id-and-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { getStorage } = require('./get-storge');

const ramda = require('ramda');
const lodash = require('lodash');

const deleteOneByIdAndTenant = (params) => {
    const TENANT_ID = ramda.path(['tenant', 'id'], params);
    const QUEUE_ID = ramda.path(['queue', 'id'], params);

    const STORAGE = getStorage();
    const QUEUES_CONTAINER = STORAGE[TENANT_ID];
    if (
       !lodash.isEmpty(QUEUES_CONTAINER)
    ) {
       const QUEUE_KEYS = Object.keys(QUEUES_CONTAINER);
       if (
          !lodash.isEmpty(QUEUE_KEYS) && 
          lodash.isArray(QUEUE_KEYS)
       ) {
          for (let key of QUEUE_KEYS) {
             let queue = QUEUES_CONTAINER[key];
             if (
                !lodash.isEmpty(queue) &&
                QUEUE_ID === key
             ) {
                QUEUES_CONTAINER[key].destroy();
                delete QUEUES_CONTAINER[key];
             }
          }
       }
    }
 
 }

module.exports = {
   deleteOneByIdAndTenant,
}
