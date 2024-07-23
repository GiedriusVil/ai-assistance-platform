/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
    purchaseRequests: 'docValidationAudits',
    docValidations: 'docValidationAudits',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
    const COLLECTIONS_CONFIGURATION = configuration?.collections;

    const PURCHASE_REQUESTS = COLLECTIONS_CONFIGURATION?.purchaseRequests;
    const DOC_VALIDATIONS = COLLECTIONS_CONFIGURATION?.docValidations;

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
        !lodash.isEmpty(PURCHASE_REQUESTS)
    ) {
        RET_VAL.purchaseRequests = PURCHASE_REQUESTS;
    }

    if (
      !lodash.isEmpty(DOC_VALIDATIONS)
  ) {
      RET_VAL.docValidations = DOC_VALIDATIONS;
  }

    return RET_VAL;
}


module.exports = {
    sanitizedCollectionsFromConfiguration,
}
