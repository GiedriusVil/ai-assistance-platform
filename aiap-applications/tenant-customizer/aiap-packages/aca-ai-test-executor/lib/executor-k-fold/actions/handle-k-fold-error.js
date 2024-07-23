/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-ai-test-executor-lib-kFoldExecutor-actions-handleKFoldError';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { saveToDB } = require('./save-to-db')

const handleKfoldError = async (context, error, calculatedMetrics, testID) => {
    try {
        calculatedMetrics['status'] = 'Error';
        calculatedMetrics['errorMessage'] = error;
        calculatedMetrics['ended'] = new Date();
        await saveToDB(context, calculatedMetrics, testID);
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', ACA_ERROR);
        throw ACA_ERROR;
    }
}
module.exports = {
    handleKfoldError
}
