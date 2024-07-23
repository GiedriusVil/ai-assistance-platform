/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rule-actions-datasource-provider-datasource-factory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { AcaRuleActionsDatasourceMongo } = require('../datasource-mongo');

const _createMongoDatasource = async (configuration) => {
    try {
        if (
            lodash.isEmpty(configuration)
        ) {
            const MESSAGE = 'Missing configuration required parameter! [EMPTY, NULL, UNDEFINED]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configuration });
        }
        const RET_VAL = new AcaRuleActionsDatasourceMongo(configuration);
        await RET_VAL.initialize();
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(`${_createMongoDatasource.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const createAcaRuleActionsDatasource = async (configuration) => {
    try {
        // 2021-12-17 [LEGO] - We will have to think about client type here!
        const RET_VAL = await _createMongoDatasource(configuration);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(`${createAcaRuleActionsDatasource.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const createAcaRuleActionsDatasources = async (configurations) => {
    try {
        if (
            !lodash.isArray(configurations)
        ) {
            const MESSAGE = 'Wrong type of provided parameter configurations! [Expected: Array]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configurations });
        }
        const PROMISES = configurations.map((configuration) => {
            return createAcaRuleActionsDatasource(configuration);
        });
        const RET_VAL = await Promise.all(PROMISES);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(`${createAcaRuleActionsDatasources.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    createAcaRuleActionsDatasource,
    createAcaRuleActionsDatasources,
}
