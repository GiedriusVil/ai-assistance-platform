/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-engagements-cache-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { saveOne } = require('./save-one');
const { findOneByIdAndHash } = require('./find-one-by-id-and-hash');

class AcaEngagementsCacheProvider {

  constructor() {
    this.type = 'AcaEngagementsCacheProvider';
  }

  get engagements() {
    const RET_VAL = {
      saveOne: (params) => {
        return saveOne(params);
      },
      findOneByIdAndHash: (params) => {
        return findOneByIdAndHash(params);
      },
    };
    return RET_VAL;
  }

}

module.exports = {
  AcaEngagementsCacheProvider,
}
