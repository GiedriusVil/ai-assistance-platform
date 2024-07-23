/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-catalogs-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
    ACTION_STATUSES,
    ACTION_TYPES,
    saveOne: saveAction,
} = require('../actions');

const deleteManyByIds = async (context, params) => {
    const PARAMS_IDS = params?.ids;
    try {
        const DATASOURCE = getDatasourceByContext(context);
        const RET_VAL = await DATASOURCE.catalogs.deleteManyByIds(context, params);
        const PROMISES = [];
        if (
            !lodash.isEmpty(PARAMS_IDS) &&
            lodash.isArray(PARAMS_IDS)
        ) {
            for (let id of PARAMS_IDS) {
                let action = {
                    id: id,
                    status: ACTION_STATUSES.status,
                    type: ACTION_TYPES.CATALOG_DELETE,
                };
                PROMISES.push(saveAction(context, { action }));
            }
        }
        await Promise.all(PROMISES);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(deleteManyByIds.name, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    deleteManyByIds,
}
