/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-service-modules-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
    calcDiffByValue
} = require('@ibm-aiap/aiap-utils-audit');

const {
    CHANGE_ACTION,
} = require('@ibm-aiap/aiap--types-server');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { readJsonFromFile } = require('../import.utils');
const { saveOne } = require('./save-one');

const { findOneById } = require('./find-one-by-id');
const ModelsChangesService = require('../models-changes');

const importMany = async (context, params) => {
    try {
      const FILE = params?.file;
      const FILTERS_FROM_FILE = await readJsonFromFile(FILE);

        if (lodash.isEmpty(FILTERS_FROM_FILE)) {
            const MESSAGE = 'Missing filters in file!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const HAS_PROPER_FILE_STRUCTURE = FILTERS_FROM_FILE.items.every(
            query => lodash.has(query, 'id') && lodash.has(query, 'ref')
        );
        if (!HAS_PROPER_FILE_STRUCTURE) {
            const MESSAGE = `Filters are not compatible for import! File must contain 'id' and 'ref' properties!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const ALL_FILTERS_ID_PRESENT = FILTERS_FROM_FILE.items.every(
            query => {
                const ID = query?.id;
                return !lodash.isEmpty(ID);
            }
        )
        if (!ALL_FILTERS_ID_PRESENT) {
            const MESSAGE = `All filters must contain 'id' values!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }

        const PROMISES = [];
        const CHANGES_PROMISES = [];
        for (let filter of FILTERS_FROM_FILE.items) {
            const DIFFERENCES = await calcDiffByValue(context, {
                service: {
                    findOneById,
                },
                value: filter,
            });

            CHANGES_PROMISES.push(ModelsChangesService.saveOne(
                context,
                {
                    value: filter,
                    action: CHANGE_ACTION.IMPORT_ONE,
                    docChanges: DIFFERENCES,
                })
            );
            const FILTERS_PARAMS = {
              value: filter,
            };
            logger.debug('->', FILTERS_PARAMS);
            PROMISES.push(saveOne(context, FILTERS_PARAMS));
        }
        await Promise.all(PROMISES);
        await Promise.all(CHANGES_PROMISES);

        const RET_VAL = {
            status: 'IMPORT SUCCESS'
        }
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}


module.exports = {
    importMany,
}
