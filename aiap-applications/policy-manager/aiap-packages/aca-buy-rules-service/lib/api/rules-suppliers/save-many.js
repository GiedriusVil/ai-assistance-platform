/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-service-rules-suppliers-save-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { saveOne } = require('./save-one');

const saveMany = async (context, params, options = { action: 'SAVE_MANY' }) => {
    const CONTEXT_USER_ID = context?.user?.id;
    let values;
    try {
        values = params?.values;
        if (
            !lodash.isArray(values)
        ) {
            const MESSAGE = `Wrong type of params.values parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const PROMISES = [];
        for (let value of values) {
            PROMISES.push(saveOne(context, { value }, options))
        }
        const RET_VAL = await Promise.all(PROMISES);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
        logger.error(`${saveMany.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
};

module.exports = {
    saveMany,
}
