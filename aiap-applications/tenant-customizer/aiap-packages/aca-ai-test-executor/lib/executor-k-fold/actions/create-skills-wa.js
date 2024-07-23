/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-ai-test-executor-lib-kFoldExecutor-actions-createSkillsWA';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { handleKfoldError } = require('./handle-k-fold-error');
const { retrieveIntentsFromDataframe } = require('../modules/utils');

const createSkillsWA = async (context, params, options) => {
    try {
        const FOLDS = options?.folds;
        const INTENTS = options?.intents;
        const ENTITIES = options?.entities;
        const ASSISTANT = options?.assistant;
        let workspaces = [];
    for (let i in lodash.range(FOLDS.length)) {
        let train = FOLDS[i]['train'];
        let int = parseInt(i);
        const INTENTS_JSON = await retrieveIntentsFromDataframe(INTENTS, train);
        const PARAMS = {
          value: {
            external: {
              name: `K-FOLD test ${int + 1}`,
              description: 'workspace created for k-fold testing',
              intents: INTENTS_JSON,
              entities: ENTITIES
            }
          }
        }
        const RET_VAL = await ASSISTANT.skills.saveOne(context, PARAMS);
        workspaces.push(RET_VAL?.skill?.workspace_id);
    }
    return workspaces;
    } catch (error) {
        const CALCULATED_METRICS = options?.calculatedMetrics;
        const TEST_ID = options?.testId;
        await handleKfoldError(context, error,CALCULATED_METRICS,TEST_ID);
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', ACA_ERROR);
        throw ACA_ERROR;
    }

    
}
module.exports = {
    createSkillsWA
}
