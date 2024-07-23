/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-datasource-mongo-classification-rules-conditions-delete-by-classification-rule-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const ReadPreference = require('mongodb').ReadPreference;

const { throwAcaError, formatIntoAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const deleteManyByRuleId = async (datasource, context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;

    const PARAMS_RULE_ID = params?.ruleId;

    const COLLECTION = datasource._collections.rulesConditions;
    const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };

    let filter;
    try {
        if (
            lodash.isUndefined(PARAMS_RULE_ID)
        ) {
            const MESSAGE = `Missing required params.rule parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        filter = { ruleId: PARAMS_RULE_ID };

        const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
        await ACA_MONGO_CLIENT
            .__deleteMany(context, {
                collection: COLLECTION,
                collectionOptions: COLLECTION_OPTIONS,
                filter: filter
            });

        const RET_VAL = {
            ruleId: PARAMS_RULE_ID,
            status: 'SUCCESS'
        };
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
        logger.error(`${deleteManyByRuleId.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    deleteManyByRuleId,
}
