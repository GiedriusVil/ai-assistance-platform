/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-datasource-mongo-ensure-default-organizations'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_ORGANIZATIONS = require('./default-organizations.json');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { findOneById } = require('../find-one-by-id');
const { saveOne } = require('../save-one');

const ensureOrganizationExistance = async (db, collections, context, params) => {
    const ORGANIZATION_ID = ramda.path(['organization', 'id'], params);
    const FIND_PARAMS = {
        id: ORGANIZATION_ID
    };
    const ORGANIZATION = await findOneById(db, collections, context, FIND_PARAMS);

    const RET_VAL = { id: ORGANIZATION_ID };
    if (
        lodash.isEmpty(ORGANIZATION)
    ) {
        await saveOne(db, collections, context, params);
        RET_VAL.status = 'CREATED';
    } else {
        RET_VAL.status = 'EXISTS';
    }
    return RET_VAL;
}

const ensureDefaultOrganizations = async (db, collections) => {
    try {
        const CONTEXT = {};
        const PARAMS = {};
        const PROMISES = [];
        for (let organization of DEFAULT_ORGANIZATIONS) {
            let params = {organization};
            PROMISES.push(ensureOrganizationExistance(db, collections, CONTEXT, params));
        }
        const RESULT = await Promise.all(PROMISES);
        const RET_VAL = { status: 'SUCCESS', result: RESULT};
        logger.info('->', {RET_VAL});
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
}

module.exports = {
    ensureDefaultOrganizations,
}
