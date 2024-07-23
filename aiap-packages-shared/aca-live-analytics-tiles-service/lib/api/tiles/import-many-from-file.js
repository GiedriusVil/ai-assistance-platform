/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-tiles-import-many';
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
      const TILES_FROM_FILE = await readJsonFromFile(FILE);

        if (lodash.isEmpty(TILES_FROM_FILE)) {
            const MESSAGE = 'Missing tiles in file!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const HAS_PROPER_FILE_STRUCTURE = TILES_FROM_FILE.items.every(
            tile => lodash.has(tile, 'id') && lodash.has(tile, 'ref')
        );
        if (!HAS_PROPER_FILE_STRUCTURE) {
            const MESSAGE = `Tiles are not compatible for import! File must contain 'id' and 'type' properties!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const ALL_TILES_ID_PRESENT = TILES_FROM_FILE.items.every(
            tile => {
                const ID = tile?.id;
                return !lodash.isEmpty(ID);
            }
        )
        if (!ALL_TILES_ID_PRESENT) {
            const MESSAGE = `All tiles must contain 'id' values!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }

        const PROMISES = [];
        const CHANGES_PROMISES = [];
        for (let tile of TILES_FROM_FILE.items) {
            const DIFFERENCES = await calcDiffByValue(context, {
                service: {
                    findOneById,
                },
                value: tile,
            });

            CHANGES_PROMISES.push(ModelsChangesService.saveOne(
                context,
                {
                    value: tile,
                    action: CHANGE_ACTION.IMPORT_ONE,
                    docChanges: DIFFERENCES,
                })
            );
            const TILES_PARAMS = {
              value: tile,
            };
            logger.debug('->', TILES_PARAMS);
            PROMISES.push(saveOne(context, TILES_PARAMS));
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
