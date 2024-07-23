/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-auditor-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const DEFAULT_COLLECTIONS = {
    lambdaModules: 'auditor_lambda_modules',
    lambdaModulesErrors: 'auditor_lambda_modules_errors',
    purchaseRequests: 'auditor_purchase_requests',
    rules: 'auditor_rules',
    rulesMessages: 'auditor_rulesMessages',
    organizations: 'auditor_organizations',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
    const COLLECTIONS_CONFIGURATION = configuration?.collections;

    const LAMBDA_MODULES = COLLECTIONS_CONFIGURATION?.lambdaModules;
    const LAMBDA_MODULES_ERRORS = COLLECTIONS_CONFIGURATION?.lambdaModulesErrors;
    const PURCHASE_REQUESTS = COLLECTIONS_CONFIGURATION?.purchaseRequests;
    const RULES = COLLECTIONS_CONFIGURATION?.rules;
    const MESSAGES = COLLECTIONS_CONFIGURATION?.rulesMessages;
    const ORGANIZATIONS = COLLECTIONS_CONFIGURATION?.organizations;

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
        !lodash.isEmpty(LAMBDA_MODULES)
    ) {
        RET_VAL.lambdaModules = LAMBDA_MODULES;
    }
    if (
        !lodash.isEmpty(LAMBDA_MODULES_ERRORS)
    ) {
        RET_VAL.lambdaModulesErrors = LAMBDA_MODULES_ERRORS;
    }
    if (
        !lodash.isEmpty(PURCHASE_REQUESTS)
    ) {
        RET_VAL.purchaseRequests = PURCHASE_REQUESTS;
    }
    if (
        !lodash.isEmpty(RULES)
    ) {
        RET_VAL.rules = RULES;
    }
    if (
        !lodash.isEmpty(MESSAGES)
    ) {
        RET_VAL.rulesMessages = MESSAGES;
    }
    if (
      !lodash.isEmpty(ORGANIZATIONS)
  ) {
      RET_VAL.organizations = ORGANIZATIONS;
  }
    return RET_VAL;
}


module.exports = {
    sanitizedCollectionsFromConfiguration,
}
