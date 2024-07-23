/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-charts-service-import-many';
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
      const CHARTS_FROM_FILE = await readJsonFromFile(FILE);

        if (lodash.isEmpty(CHARTS_FROM_FILE)) {
            const MESSAGE = 'Missing charts in file!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const HAS_PROPER_FILE_STRUCTURE = CHARTS_FROM_FILE.items.every(
            chart => lodash.has(chart, 'id') && lodash.has(chart, 'ref')
        );
        if (!HAS_PROPER_FILE_STRUCTURE) {
            const MESSAGE = `Charts are not compatible for import! File must contain 'id' and 'ref' properties!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const ALL_CHARTS_ID_PRESENT = CHARTS_FROM_FILE.items.every(
            chart => {
                const ID = chart?.id;
                return !lodash.isEmpty(ID);
            }
        )
        if (!ALL_CHARTS_ID_PRESENT) {
            const MESSAGE = `All charts must contain 'id' values!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }

        const PROMISES = [];
        const CHANGES_PROMISES = [];
        for (let chart of CHARTS_FROM_FILE.items) {
            const DIFFERENCES = await calcDiffByValue(context, {
                service: {
                    findOneById,
                },
                value: chart,
            });

            CHANGES_PROMISES.push(ModelsChangesService.saveOne(
                context,
                {
                    value: chart,
                    action: CHANGE_ACTION.IMPORT_ONE,
                    docChanges: DIFFERENCES,
                })
            );
            const CHARTS_PARAMS = {
              value: chart,
            };
            logger.debug('->', CHARTS_PARAMS);
            PROMISES.push(saveOne(context, CHARTS_PARAMS));
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
