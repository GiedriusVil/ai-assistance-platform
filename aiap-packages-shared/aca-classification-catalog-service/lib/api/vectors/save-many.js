/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-vectors-save-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { saveOne } = require('./save-one');

const saveMany = async (context, params) => {
    const PARAMS_VECTORS = params?.vectors;
    try {
        const PROMISES = [];
        if (
            !lodash.isEmpty(PARAMS_VECTORS) &&
            lodash.isArray(PARAMS_VECTORS)
        ) {
            for (let vector of PARAMS_VECTORS) {
                PROMISES.push(saveOne(context, { vector }));
            }
        }
        const RET_VAL = await Promise.all(PROMISES);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(`${saveMany.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    saveMany,
}
