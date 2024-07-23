/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-cache-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { findOneByExternalId } = require('./find-one-by-external-id');
const { reloadOneByExternalId } = require('./reload-one-by-external-id');

class AcaOrganizationsCacheProvider {

  constructor() {
      this.type = 'AcaOrganizationsCacheProvider';
  }

  async initialize() {
  }

  get organizations() {
    const RET_VAL = {
      findOneByExternalId: (context, params) => {
        return findOneByExternalId(context, params);
      },
      reloadOneByExternalId: (context, params) => {
        return reloadOneByExternalId(context, params);
      },
    };
    return RET_VAL;
  }
}

module.exports = {
  AcaOrganizationsCacheProvider,
};
