/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-dashboards-import-many';
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
      const DASHBOARDS_FROM_FILE = await readJsonFromFile(FILE);

        if (lodash.isEmpty(DASHBOARDS_FROM_FILE)) {
            const MESSAGE = 'Missing dashboards in file!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const HAS_PROPER_FILE_STRUCTURE = DASHBOARDS_FROM_FILE.items.every(
            dashboard => lodash.has(dashboard, 'id') && lodash.has(dashboard, 'ref')
        );
        if (!HAS_PROPER_FILE_STRUCTURE) {
            const MESSAGE = `Dashboards are not compatible for import! File must contain 'id' and 'ref' properties!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const ALL_DASHBOARDS_ID_PRESENT = DASHBOARDS_FROM_FILE.items.every(
          dashboard => {
                const ID = dashboard?.id;
                return !lodash.isEmpty(ID);
            }
        )
        if (!ALL_DASHBOARDS_ID_PRESENT) {
            const MESSAGE = `All dashboards must contain 'id' values!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }

        const PROMISES = [];
        for (let dashboard of DASHBOARDS_FROM_FILE.items) {
            const DIFFERENCES = await calcDiffByValue(context, {
                service: {
                    findOneById,
                },
                value: dashboard,
            });

            CHANGES_PROMISES.push(ModelsChangesService.saveOne(
                context,
                {
                    value: dashboard,
                    action: CHANGE_ACTION.IMPORT_ONE,
                    docChanges: DIFFERENCES,
                })
            );
            const DASHBOARDS_PARAMS = {
              value: dashboard,
            };
            logger.debug('->', DASHBOARDS_PARAMS);
            PROMISES.push(saveOne(context, DASHBOARDS_PARAMS));
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
