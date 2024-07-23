/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-rules-datasource-mongo-ensure-default-rules';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_ORGS = require('@ibm-aca/aca-organizations-datasource-provider/lib/datasource-mongo/organizations/ensure-default-organizations/default-organizations.json');
const DEFAULT_MESSAGES = require('../../rules-messages/ensure-default-messages/default-messages.json');

const { saveOne } = require('../save-one');

const { getDefaultRules } = require('./default-rules');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const ensureDefaultRules = async (db, collections) => {
    try {
        if (
            !lodash.isEmpty(DEFAULT_ORGS) &&
            lodash.isArray(DEFAULT_ORGS)
        ) {
            const PROMISES = [];
            for (let [index, org] of DEFAULT_ORGS.entries()) {
                const CONTEXT = {};
                const DEFAULT_RULES = getDefaultRules(org, DEFAULT_MESSAGES[index]);
                for (let defaultRule of DEFAULT_RULES) {
                    const PARAMS = {
                        rule: defaultRule
                    };
                    PROMISES.push(saveOne(db, collections, CONTEXT, PARAMS));
                    logger.info(`Default rule - '${defaultRule.name}' for '${org.name}'_ ensured!`);
                }
            }
            await Promise.all(PROMISES);
        } else {
            logger.warn('No default organizations identified!');
        }
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('ensureDefaultRules', { ACA_ERROR });
        throw ACA_ERROR;
    }
};

module.exports = {
    ensureDefaultRules
}
