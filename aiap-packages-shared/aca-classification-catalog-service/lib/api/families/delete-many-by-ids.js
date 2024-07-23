/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-families-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getDatasourceByContext } = require('../datasource.utils');

const {
    ACTION_STATUSES,
    ACTION_TYPES,
    saveOne: saveAction,
} = require('../actions');

const deleteManyByIds = async (context, params) => {
    const PARAMS_IDS = params?.ids;
    const PARAMS_CATALOG_ID = params?.catalogId;
    try {
        const DATASOURCE = getDatasourceByContext(context);
        const RET_VAL = await DATASOURCE.families.deleteManyByIds(context, params);
        const PROMISES = [];
        if (
            !lodash.isEmpty(PARAMS_IDS) &&
            lodash.isArray(PARAMS_IDS)
        ) {
            for (let id of PARAMS_IDS) {
                let action = {
                    id: id,
                    catalogId: PARAMS_CATALOG_ID,
                    status: ACTION_STATUSES.IDLE,
                    type: ACTION_TYPES.FAMILY_DELETE,
                }
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
