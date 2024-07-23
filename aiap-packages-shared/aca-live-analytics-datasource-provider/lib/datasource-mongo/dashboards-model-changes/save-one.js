
/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-datasource-provider-dashboard-models-changes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const { v4: uuidv4 } = require('uuid');

const { throwAcaError, appendDataToError, formatIntoAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    const COLLECTION = datasource._collections.dashboardsChanges;

    let value;
    let valueId;

    let filter;
    let updateCondition;
    let updateOptions;
    try {
        value = params?.value;
        if (
            lodash.isEmpty(value)
        ) {
            const MESSAGE = `Missing required params.value paramater!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }

        valueId = ramda.pathOr(uuidv4(), ['id'], value);
        if (
            validator.isUUID(valueId) ||
            validator.isAlphanumeric(valueId, 'en-US', { ignore: '$_-' })
        ) {
            filter = { _id: { $eq: valueId } };
        } else {
            const ERROR_MESSAGE = `Invalid required params?.value?.id parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
        }

        delete value.id;
        updateCondition = { $set: value };
        updateOptions = { upsert: true };

        const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
        await ACA_MONGO_CLIENT
            .__updateOne(context,
                {
                    collection: COLLECTION,
                    filter: filter,
                    update: updateCondition,
                    options: updateOptions
                });

        const RET_VAL = await findOneById(datasource, context, { id: valueId });
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, updateCondition, updateOptions });
        logger.error(saveOne.name, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    saveOne,
}