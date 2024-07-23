/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-test-executor-k-fold-modules-create-folds';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const pythonWrapper = require('@ibm-aca/aca-python-wrapper');

const createFolds = async (dataframe, kFoldNumber) => {
    try {
        const DATAFRAME_INDEXES = dataframe?.index;
        if (DATAFRAME_INDEXES.length < kFoldNumber) {
            const ACA_ERROR = {
                type: 'SYSTEM_ERROR', 
                message: `[${MODULE_ID}] Cannot have number of splits n_splits=${kFoldNumber} greater than the number of samples: n_samples=${dataframe.index_arr.length}` 
            };
            throw  ACA_ERROR;
        }
        const DF_INTENT = dataframe?.$dataIncolumnFormat?.[0];
        const DF_TEXT = dataframe?.$dataIncolumnFormat?.[1];
        const STRAT_K_FOLD = await pythonWrapper.SKLearn('model_selection', ['StratifiedKFold', kFoldNumber], [['split', DF_TEXT, DF_INTENT]]);
        let retVal;
        try {
            retVal = JSON.parse(STRAT_K_FOLD)
        } catch(error) {
            const ACA_ERROR = {
                type: 'SYSTEM_ERROR', 
                message: `[${MODULE_ID}] Unable to parse json!`, 
                rawJson: STRAT_K_FOLD
            }
            throw ACA_ERROR;
        }
        return retVal;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
}

module.exports = createFolds;
