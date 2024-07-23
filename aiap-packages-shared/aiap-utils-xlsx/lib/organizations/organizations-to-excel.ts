/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-organizations-json-to-excel';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const excelJS = require('exceljs');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  DEFAULT_BUSINESS_ACTION,
  addDefaultTextAlignmentOptions,
} from '../shared';

import {
  ORGANIZATIONS_XLS_SCHEMA,
} from './schema';

const _sanitizedRows = (
  rows: any,
) => {
  const RET_VAL = [];
  if (
    lodash.isArray(rows) &&
    !lodash.isEmpty(rows)
  ) {
    rows.forEach(row => {
      const SANITIZED_ROW = lodash.cloneDeep(row);
      SANITIZED_ROW.s_action = DEFAULT_BUSINESS_ACTION,
        SANITIZED_ROW.externalId = row?.external?.id;
      RET_VAL.push(SANITIZED_ROW);
    });
  }
  return RET_VAL;
};

const _addActionsColumn = (
  sheet: any,
) => {
  if (
    !lodash.isEmpty(sheet)
  ) {
    const LAST_COLUMN_INDEX = sheet.columnCount;
    for (let i = 2; i <= sheet.rowCount; i++) {
      sheet.getRow(i).getCell(LAST_COLUMN_INDEX).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"CREATE, UPDATE"']
      };
    }
  }
}

export const organizationsToExcel = async (
  rows: any,
  sheetName = 'ORGANIZATIONS',
) => {
  try {
    const WORKBOOK = new excelJS.Workbook();
    const SHEET = WORKBOOK.addWorksheet(sheetName);
    const SANITIZED_ROWS = _sanitizedRows(rows);
    SHEET.columns = ORGANIZATIONS_XLS_SCHEMA;
    SHEET.addRows(SANITIZED_ROWS);
    _addActionsColumn(SHEET);
    addDefaultTextAlignmentOptions(SHEET);
    const RET_VAL = WORKBOOK.xlsx.writeBuffer();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(organizationsToExcel.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
