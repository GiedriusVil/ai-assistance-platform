/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-jobs-queue-runtime-storage-get-one-by-id-and-tenant`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getStorage } = require('./get-storge');

const getOneByIdAndTenant = (params) => {
  try {
    const STORAGE = getStorage();
    const TENANT_ID = ramda.path(['tenant', 'id'], params);
    const QUEUE_ID = ramda.path(['queue', 'id'], params);

    const QUEUES_CONTAINER = STORAGE[TENANT_ID];
    let RET_VAL;
    if (
      !lodash.isEmpty(QUEUES_CONTAINER)
    ) {
      const QUEUE_KEYS = Object.keys(QUEUES_CONTAINER);
      if (
        !lodash.isEmpty(QUEUE_KEYS) &&
        lodash.isArray(QUEUE_KEYS)
      ) {
        for (let key of QUEUE_KEYS) {
          let queue;
          if (key === QUEUE_ID) {
            queue = QUEUES_CONTAINER[key];
          }
          if (
            !lodash.isEmpty(queue)
          ) {
            RET_VAL = queue;
          }
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getOneByIdAndTenant,
}
