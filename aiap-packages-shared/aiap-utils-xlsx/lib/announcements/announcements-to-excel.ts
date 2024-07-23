/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-json-to-excel';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const excelJS = require('exceljs');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';


const { ANNOUNCEMENT_XLS_SCHEMA } = require('./schema');
const { addDefaultTextAlignmentOptions } = require('../shared');

const _sanitizedRows = (
  rows: Array<any>,
) => {
  const RET_VAL = [];
  if (
    lodash.isArray(rows) &&
    !lodash.isEmpty(rows)
  ) {
    rows.forEach(row => {
      const SANITIZED_ROW = lodash.cloneDeep(row);
      SANITIZED_ROW.seller = row?.seller?.CompanyName;
      SANITIZED_ROW.sellerId = row?.seller?.CompanyAccountId;
      SANITIZED_ROW.sellerCountry = row?.seller?.Country;
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

export const announcementsToExcel = async (
  rows: any,
  sheetName = 'ANNOUNCEMENTS'
) => {
  try {
    const WORKBOOK = new excelJS.Workbook();
    const SHEET = WORKBOOK.addWorksheet(sheetName);
    const SANITIZED_ROWS = _sanitizedRows(rows);
    SHEET.columns = ANNOUNCEMENT_XLS_SCHEMA;
    SHEET.addRows(SANITIZED_ROWS);
    _addActionsColumn(SHEET);
    addDefaultTextAlignmentOptions(SHEET);
    const RET_VAL = WORKBOOK.xlsx.writeBuffer();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(announcementsToExcel.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
