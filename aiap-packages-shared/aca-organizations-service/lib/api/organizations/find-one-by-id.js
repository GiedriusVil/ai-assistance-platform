/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-service-organizations-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const {
    getAcaOrganizationsDatasourceByContext, 
} = require('@ibm-aca/aca-organizations-datasource-provider');

const _findOneById = async (context, params) => {
    const DATASOURCE = getAcaOrganizationsDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.organizations.findOneById(context, params);
    return RET_VAL;
}

const findOneById = async (context, params) => {
    try {
        const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _findOneById, context, params);
        return RET_VAL;
    } catch(error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
};

module.exports = {
    findOneById,
}
