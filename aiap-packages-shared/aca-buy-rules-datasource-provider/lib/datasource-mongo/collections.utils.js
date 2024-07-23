/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const DEFAULT_COLLECTIONS = {
    rules: 'buyRules',
    rulesAudits: 'buyRulesAudits',
    rulesConditions: 'buyRulesConditions',
    rulesSuppliers: 'buyRulesSuppliers',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
    try {
        const COLLECTIONS_CONFIGURATION = configuration?.collections;

        const RULES = COLLECTIONS_CONFIGURATION?.rules;
        const RULES_CONDITIONS = COLLECTIONS_CONFIGURATION?.rulesConditions;
        const RULES_SUPPLIERS = COLLECTIONS_CONFIGURATION?.rulesSuppliers;
        const RULES_AUDITS = COLLECTIONS_CONFIGURATION?.rulesAudits;

        const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
        if (
          !lodash.isEmpty(RULES)
        ) {
            RET_VAL.rules = RULES;
        }
        if (
          !lodash.isEmpty(RULES_CONDITIONS)
        ) {
            RET_VAL.rulesConditions = RULES_CONDITIONS;
        }
        if (
          !lodash.isEmpty(RULES_SUPPLIERS)
        ) {
            RET_VAL.rulesSuppliers = RULES_SUPPLIERS;
        }
        if (
          !lodash.isEmpty(RULES_AUDITS)
        ) {
          RET_VAL.rulesAudits = RULES_AUDITS;
        }
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(`${sanitizedCollectionsFromConfiguration.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
}


module.exports = {
    sanitizedCollectionsFromConfiguration,
}
