/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-ai-test-executor-lib-kFoldExecutor-actions-deleteWorkspaces';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const deleteSkillsWA = async (context, params, options) => {
    const ASSISTANT = options?.assistant;
    const WORKSPACES = options?.workspaces;
    try {
        if (!lodash.isEmpty(WORKSPACES)) {
            await ASSISTANT.skills.deleteManyByIds(context, {
              ids: WORKSPACES
            });
        }
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', ACA_ERROR);
        throw ACA_ERROR;
    }
}
module.exports = {
    deleteSkillsWA
}
