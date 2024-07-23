
/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-catalogs-save-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors')

const { saveOne } = require('./save-one');

const saveMany = async (datasource, context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    const PARAMS_CATALOGS = params?.catalogs;
    try {
        if (
            !lodash.isArray(PARAMS_CATALOGS)
        ) {
            const MESSAGE = `Wrong type of params.catalogs attribute! [Expected: Array]`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const PROMISES = [];
        if (
            !lodash.isEmpty(PARAMS_CATALOGS)
        ) {
            for (let catalog of PARAMS_CATALOGS) {
                PROMISES.push(saveOne(datasource, context, { catalog }));
            }
        }
        await Promise.all(PROMISES);
        const RET_VAL = {
            status: 'success'
        }
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
        logger.error(saveMany.name, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    saveMany
}
