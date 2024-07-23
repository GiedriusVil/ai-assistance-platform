/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-ai-test-executor-lib-kFoldExecutor-actions-getEntities';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { handleKfoldError } = require('./handle-k-fold-error');
const { transformSynonymsToStringArray } = require('../modules/utils');

const getEntities = async (context, params,options) => {
    try {
        const ASSISTANT = options?.assistant;
        const PARAMS = {
          query: {
            filter: {
              aiSkill: params,
            }
          },
        };
        const ENTITIES = await ASSISTANT.entities.retrieveManyByQueryWithValues(context, PARAMS);
        const transformed = transformSynonymsToStringArray(ENTITIES?.items);
        return transformed;
    } catch (error) {
        const TEST_ID = options?.testID;
        const CALCULATED_METRICS = options?.calculatedMetrics;
        await handleKfoldError(context, error,CALCULATED_METRICS,TEST_ID);
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', ACA_ERROR);
        throw ACA_ERROR;
    }

}
module.exports = {
    getEntities
}
