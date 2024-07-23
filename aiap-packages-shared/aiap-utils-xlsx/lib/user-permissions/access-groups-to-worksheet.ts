/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-user-permissions-access-groups-to-worksheet';

const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import * as ExcelJS from 'exceljs';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  translationsService,
} from '@ibm-aiap/aiap-app-service';

import {
  ACCESS_GROUP_SCHEMA,
} from './schema';

import {
  formatWorksheet,
} from './utils';

import {
  transformAccessGroups,
} from './transformers';

const accessGroupsToWorksheet = async (
  workbook: ExcelJS.Workbook,
  accessGroups: any,
  sheetName = 'Permissions',
) => {
  try {
    const WORKSHEET = workbook.addWorksheet(sheetName);

    WORKSHEET.columns = ACCESS_GROUP_SCHEMA;

    const TRANSLATIONS = await translationsService.findOneByQuery({}, {
      query: {
        filter: {
          application: 'portal',
          lang: 'en-US',
        }
      }
    });

    const ACCESS_GROUPS = transformAccessGroups(accessGroups, TRANSLATIONS);

    WORKSHEET.addRows(ACCESS_GROUPS);

    formatWorksheet(WORKSHEET);

    return WORKSHEET;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(accessGroupsToWorksheet.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  accessGroupsToWorksheet
}
