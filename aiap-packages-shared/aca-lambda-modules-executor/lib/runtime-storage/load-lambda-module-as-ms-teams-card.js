/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-executor-load-lambda-module-as-ms-teams-card';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getOneByIdAndTenant } = require('./get-one-by-id-and-tenant');

const loadLambdaModuleAsMsTeamsCard = async (context, params) => {
    const LAMBDA_MODULE_RUNTIME_ID = ramda.path(['lambdaModule', 'id'], params);
    const TENANT_ID = ramda.path(['tenant', 'id'], params);
    const LAMBDA_MODULE = getOneByIdAndTenant({id:LAMBDA_MODULE_RUNTIME_ID,tenant:{id:TENANT_ID}});

    let retVal;
    if (LAMBDA_MODULE && LAMBDA_MODULE.AdaptiveCard) {
        retVal = await LAMBDA_MODULE.AdaptiveCard(context, params);
    } else if (LAMBDA_MODULE && !LAMBDA_MODULE.AdaptiveCard) {
        logger.warn(`[${MODULE_ID}] Unable to process lambda module of type MS_TEAMS_CARD! Module type structure requirements not met - missing exported module AdaptiveCard! ->`, LAMBDA_MODULE_RUNTIME_ID);
    } else if (lodash.isEmpty(LAMBDA_MODULE)) {
        logger.error(`[${MODULE_ID}] Lambda module of type MS_TEAMS_CARD not found! ->`, LAMBDA_MODULE_RUNTIME_ID);
    }

    return retVal;
}

module.exports = {
    loadLambdaModuleAsMsTeamsCard,
}
