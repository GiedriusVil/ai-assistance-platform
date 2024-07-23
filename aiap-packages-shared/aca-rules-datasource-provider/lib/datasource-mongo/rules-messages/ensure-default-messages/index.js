/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-rules-datasource-mongo-ensure-default-messages';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_MESSAGES = require('./default-messages.json');

const { saveOne } = require('../save-one');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const ensureDefaultMessages = async (db, collections) => {
    try {
        const CONTEXT = {};
        const PROMISES = [];
        for (let defaultMessage of DEFAULT_MESSAGES) {
            const PARAMS = {
                message: defaultMessage
            };
            PROMISES.push(saveOne(db, collections, CONTEXT, PARAMS));
            logger.info(`Default message - '${defaultMessage.name}' ensured!`);
        }
        await Promise.all(PROMISES);
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('ensureDefaultMessages', { ACA_ERROR });
        throw ACA_ERROR;
    }
};

module.exports = {
    ensureDefaultMessages
}
